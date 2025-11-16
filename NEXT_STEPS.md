
# Next Steps - Anatomy Trainer App

**Priority-ordered action items for completing the app**

---

## 🔥 CRITICAL (Do First)

### 1. Database Setup ⏳

Create the necessary database tables and RLS policies in Supabase.

**Tables Needed:**

#### A. User Profiles Table
```sql
-- Create user profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  subscription_status TEXT DEFAULT 'free' CHECK (subscription_status IN ('free', 'trial', 'premium')),
  trial_ends_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

#### B. User Progress Table
```sql
-- Create user progress table
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  muscle_id TEXT NOT NULL,
  times_studied INTEGER DEFAULT 0,
  last_studied_at TIMESTAMP WITH TIME ZONE,
  mastery_level INTEGER DEFAULT 0 CHECK (mastery_level >= 0 AND mastery_level <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, muscle_id)
);

-- Enable RLS
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own progress"
  ON user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON user_progress FOR UPDATE
  USING (auth.uid() = user_id);
```

#### C. Game Sessions Table
```sql
-- Create game sessions table
CREATE TABLE game_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  region TEXT NOT NULL,
  muscles_studied TEXT[] NOT NULL,
  score INTEGER DEFAULT 0,
  total_cards INTEGER NOT NULL,
  correct_cards INTEGER DEFAULT 0,
  duration_seconds INTEGER,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own sessions"
  ON game_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sessions"
  ON game_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions"
  ON game_sessions FOR UPDATE
  USING (auth.uid() = user_id);
```

#### D. Achievements Table
```sql
-- Create achievements table
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  name_fr TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_fr TEXT,
  description_en TEXT,
  icon TEXT,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user achievements table
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  achievement_id UUID REFERENCES achievements NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Enable RLS
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own achievements"
  ON user_achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements"
  ON user_achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Everyone can view achievement definitions
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view achievements"
  ON achievements FOR SELECT
  TO authenticated
  USING (true);
```

**How to Apply:**
1. Go to Supabase Dashboard → SQL Editor
2. Copy and paste each SQL block
3. Run each block separately
4. Verify tables are created in Table Editor

---

### 2. Update App to Use Database ⏳

Modify the app to read/write from the database instead of local state.

**Files to Update:**

#### A. Create Database Hooks
```typescript
// hooks/useUserProgress.ts
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import { useSupabase } from '@/contexts/SupabaseContext';

export function useUserProgress() {
  const { user } = useSupabase();
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchProgress = async () => {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching progress:', error);
      } else {
        setProgress(data || []);
      }
      setLoading(false);
    };

    fetchProgress();
  }, [user]);

  const updateProgress = async (muscleId: string, masteryLevel: number) => {
    if (!user) return;

    const { error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: user.id,
        muscle_id: muscleId,
        mastery_level: masteryLevel,
        times_studied: 1, // Increment in SQL
        last_studied_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Error updating progress:', error);
    }
  };

  return { progress, loading, updateProgress };
}
```

#### B. Update Card Game to Save Progress
```typescript
// In app/card-game.tsx
import { useUserProgress } from '@/hooks/useUserProgress';

// Inside component:
const { updateProgress } = useUserProgress();

// When game completes:
const handleGameComplete = async () => {
  // Save session to database
  const { error } = await supabase
    .from('game_sessions')
    .insert({
      user_id: user.id,
      region: 'shoulder',
      muscles_studied: completedMuscles,
      score: totalScore,
      total_cards: totalCards,
      correct_cards: correctCards,
      completed_at: new Date().toISOString(),
    });

  // Update progress for each muscle
  for (const muscleId of completedMuscles) {
    await updateProgress(muscleId, calculateMasteryLevel(muscleId));
  }
};
```

---

## 🎯 HIGH PRIORITY (Do Next)

### 3. Implement Payment System ⏳

Set up subscription payments using Stripe or similar.

**Steps:**

1. **Choose Payment Provider**
   - Recommended: Stripe (best React Native support)
   - Alternative: RevenueCat (easier subscription management)

2. **Install Dependencies**
   ```bash
   npm install @stripe/stripe-react-native
   ```

3. **Create Stripe Edge Function**
   ```typescript
   // supabase/functions/create-payment-intent/index.ts
   import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
   import Stripe from 'https://esm.sh/stripe@11.1.0?target=deno';

   const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
     apiVersion: '2022-11-15',
   });

   serve(async (req) => {
     try {
       const { amount } = await req.json();

       const paymentIntent = await stripe.paymentIntents.create({
         amount,
         currency: 'eur',
       });

       return new Response(
         JSON.stringify({ clientSecret: paymentIntent.client_secret }),
         { headers: { 'Content-Type': 'application/json' } }
       );
     } catch (error) {
       return new Response(
         JSON.stringify({ error: error.message }),
         { status: 400, headers: { 'Content-Type': 'application/json' } }
       );
     }
   });
   ```

4. **Update Subscription Screen**
   - Add Stripe payment form
   - Handle payment success/failure
   - Update user subscription status in database

---

### 4. Add Push Notifications ⏳

Implement push notifications for study reminders.

**Steps:**

1. **Install Expo Notifications**
   ```bash
   npx expo install expo-notifications
   ```

2. **Request Permissions**
   ```typescript
   // utils/notifications.ts
   import * as Notifications from 'expo-notifications';

   export async function registerForPushNotifications() {
     const { status } = await Notifications.requestPermissionsAsync();
     if (status !== 'granted') {
       return null;
     }

     const token = await Notifications.getExpoPushTokenAsync();
     return token.data;
   }
   ```

3. **Save Token to Database**
   ```sql
   ALTER TABLE profiles ADD COLUMN push_token TEXT;
   ```

4. **Schedule Notifications**
   ```typescript
   await Notifications.scheduleNotificationAsync({
     content: {
       title: 'Time to study!',
       body: 'Review your shoulder muscles',
     },
     trigger: {
       hour: 9,
       minute: 0,
       repeats: true,
     },
   });
   ```

---

## 📊 MEDIUM PRIORITY (Do After)

### 5. Add Analytics ⏳

Track user behavior and app performance.

**Options:**
- Expo Analytics (built-in)
- Firebase Analytics
- Mixpanel
- Amplitude

**Implementation:**
```typescript
// utils/analytics.ts
import * as Analytics from 'expo-analytics';

export const trackEvent = (eventName: string, properties?: object) => {
  Analytics.logEvent(eventName, properties);
};

// Usage:
trackEvent('game_started', { region: 'shoulder' });
trackEvent('game_completed', { score: 85, duration: 120 });
```

---

### 6. Implement Achievements System ⏳

Gamify the learning experience with achievements.

**Achievements to Add:**
- First Study Session
- 5 Study Sessions
- 10 Study Sessions
- Master a Muscle (100% mastery)
- Master All Shoulder Muscles
- Perfect Game (100% correct)
- Study Streak (7 days)
- Study Streak (30 days)

**Implementation:**
```typescript
// utils/achievements.ts
export const checkAchievements = async (userId: string) => {
  // Check for new achievements
  const sessions = await getGameSessions(userId);
  
  if (sessions.length === 1) {
    await unlockAchievement(userId, 'first_session');
  }
  
  if (sessions.length === 5) {
    await unlockAchievement(userId, 'five_sessions');
  }
  
  // Check for perfect game
  const lastSession = sessions[0];
  if (lastSession.correct_cards === lastSession.total_cards) {
    await unlockAchievement(userId, 'perfect_game');
  }
};
```

---

### 7. Add Progress Dashboard ⏳

Create a comprehensive progress tracking screen.

**Features:**
- Overall progress percentage
- Muscles mastered
- Study streak
- Total study time
- Recent achievements
- Progress charts

**Implementation:**
```typescript
// app/(tabs)/progress.tsx
export default function ProgressScreen() {
  const { progress } = useUserProgress();
  const { sessions } = useGameSessions();
  
  const totalMuscles = 15;
  const masteredMuscles = progress.filter(p => p.mastery_level >= 80).length;
  const progressPercentage = (masteredMuscles / totalMuscles) * 100;
  
  return (
    <ScrollView>
      <ProgressCircle percentage={progressPercentage} />
      <MusclesList progress={progress} />
      <RecentSessions sessions={sessions} />
      <Achievements />
    </ScrollView>
  );
}
```

---

## 🎨 LOW PRIORITY (Nice to Have)

### 8. Add More Regions ⏳

Expand beyond shoulder muscles.

**Regions to Add:**
- Arm muscles
- Forearm muscles
- Hand muscles
- Leg muscles
- Foot muscles
- Back muscles
- Chest muscles
- Abdomen muscles

---

### 9. Add Social Features ⏳

Allow users to compete and share progress.

**Features:**
- Leaderboards
- Share achievements
- Challenge friends
- Study groups

---

### 10. Add Offline Support ⏳

Allow app to work without internet connection.

**Implementation:**
- Cache muscle data locally
- Queue database updates
- Sync when online
- Show offline indicator

---

## ✅ TESTING CHECKLIST

Before each release:

### Functional Testing:
- [ ] Sign up flow works
- [ ] Email verification works
- [ ] Sign in flow works
- [ ] Sign out works
- [ ] Card game works
- [ ] Progress saves correctly
- [ ] Payments work (if implemented)
- [ ] Notifications work (if implemented)

### Platform Testing:
- [ ] iOS app works
- [ ] Android app works
- [ ] Web app works
- [ ] Tablet layouts work
- [ ] Dark mode works
- [ ] Light mode works

### Performance Testing:
- [ ] App starts quickly
- [ ] Animations are smooth
- [ ] No memory leaks
- [ ] Database queries are fast
- [ ] Images load quickly

### Security Testing:
- [ ] RLS policies work
- [ ] Auth tokens are secure
- [ ] Sensitive data is encrypted
- [ ] API keys are not exposed

---

## 📅 SUGGESTED TIMELINE

### Week 1: Database & Core Features
- Day 1-2: Set up database tables
- Day 3-4: Integrate database with app
- Day 5-7: Test and fix bugs

### Week 2: Payments & Notifications
- Day 1-3: Implement payment system
- Day 4-5: Add push notifications
- Day 6-7: Test and fix bugs

### Week 3: Polish & Testing
- Day 1-2: Add analytics
- Day 3-4: Implement achievements
- Day 5-7: Comprehensive testing

### Week 4: Launch Preparation
- Day 1-2: Final bug fixes
- Day 3-4: App store preparation
- Day 5: Soft launch
- Day 6-7: Monitor and fix issues

---

## 🚀 LAUNCH CHECKLIST

### Pre-Launch:
- [ ] All critical features implemented
- [ ] All tests passing
- [ ] Performance optimized
- [ ] Security audit completed
- [ ] Privacy policy ready
- [ ] Terms of service ready
- [ ] App store assets ready
- [ ] Marketing materials ready

### Launch Day:
- [ ] Submit to App Store
- [ ] Submit to Google Play
- [ ] Deploy web version
- [ ] Announce on social media
- [ ] Monitor error rates
- [ ] Monitor user feedback
- [ ] Be ready for hotfixes

### Post-Launch:
- [ ] Collect user feedback
- [ ] Fix critical bugs
- [ ] Plan feature updates
- [ ] Monitor analytics
- [ ] Engage with users

---

**Good luck with your launch! 🎉**

The foundation is solid, now it's time to build the features that will make your app successful!
