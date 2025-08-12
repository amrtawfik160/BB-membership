# Claude Code Instructions

## Task Master AI Instructions

**Import Task Master's development workflow commands and guidelines, treat as if import is in the main CLAUDE.md file.**
@./.taskmaster/CLAUDE.md

## Project PRD

# Simplified PRD: Single Waitlist Landing Page for BB Membership

Based on your requirements for a **simplified, single waitlist** with a **Next.js landing page** embedded in Squarespace, here's the updated project specification:

---

## **Project Overview**

**Objective**: Build a single waitlist landing page for BB (Brickell Babes) Membership using Next.js. The page will be embedded directly into Squarespace as a complete page (not widgets), featuring a multi-step form for better UX and referral functionality.

---

## **Technology Stack**

-   **Framework**: Next.js 14+ (App Router)
-   **Database**: Supabase (PostgreSQL)
-   **Payment Processing**: Stripe API (Setup Intent)
-   **Styling**: Tailwind CSS (latest version) for clean, soft aesthetic
-   **Hosting**: Vercel
-   **Language**: TypeScript

---

## **Simplified Database Schema**

### **users**

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Personal Info (Step 1)
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  date_of_birth DATE NOT NULL,
  instagram_handle VARCHAR(100),
  linkedin_url TEXT,

  -- Location & Demographics (Step 2)
  age_range VARCHAR(20) NOT NULL, -- 20s, 30s, 40s, 50s, 60s+
  neighborhood VARCHAR(100) NOT NULL,
  occupation TEXT NOT NULL,

  -- Interests (Step 3)
  interests TEXT[], -- Array of selected interests
  marketing_opt_in BOOLEAN DEFAULT false,

  -- Referral System
  referral_code VARCHAR(50) UNIQUE NOT NULL,
  referred_by VARCHAR(50), -- Referrer's code
  waitlist_position INTEGER,
  referral_count INTEGER DEFAULT 0,

  -- Payment (Step 4)
  stripe_customer_id VARCHAR(255),
  stripe_payment_method_id VARCHAR(255),
  payment_completed BOOLEAN DEFAULT false,

  -- Tracking
  ip_address INET,
  user_agent TEXT,
  utm_source VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### **referrals**

```sql
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  referee_id UUID REFERENCES users(id) ON DELETE CASCADE,
  referral_code VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## **Landing Page Structure & Flow**

### **Page Layout**

```
Hero Section → Benefits → Membership Tiers → Multi-Step Form → Footer
```

### **Multi-Step Form Flow**

#### **Step 1: Personal Information**

-   First Name, Last Name
-   Date of Birth
-   Email Address
-   Instagram Handle (optional)
-   LinkedIn Profile (optional)

#### **Step 2: Location & Background**

-   Age Range (dropdown)
-   Neighborhood (dropdown with Miami areas)
-   Occupation/Industry (text field)

#### **Step 3: Interests & Preferences**

-   What are you most excited about? (checkbox selection)
    -   Social Events & Fitness
    -   Networking & Mentorship
    -   Business & Finance Talks
    -   Member Perks & Discounts
-   Marketing opt-in checkbox

#### **Step 4: Payment Information**

-   Stripe Elements for payment method collection
-   Clear messaging: "No charge today - secures your spot"
-   Terms acceptance

#### **Step 5: Confirmation & Referral**

-   Welcome message with waitlist position
-   Unique referral code display
-   Social sharing buttons
-   Copy referral link functionality

---

## **Design Specifications**

Based on the attached image showing clean, soft aesthetic:

### **Color Palette**

-   **Primary Pink**: #FF6B9D (brand highlight)
-   **Soft Neutrals**: #F8F9FA, #E9ECEF
-   **Text**: #2D3436 (dark gray)
-   **Accents**: #74B9FF (soft blue)

### **Typography**

-   **Headings**: Modern sans-serif (Inter/Poppins)
-   **Body**: Clean, readable (Inter)
-   **Sizes**: Large, spacious for feminine, elegant feel

### **Visual Elements**

-   **Hero Background**: High-quality image of diverse, ambitious women
-   **Soft Gradients**: Subtle pink-to-white gradients
-   **Rounded Corners**: 8px border radius for modern feel
-   **Ample White Space**: Clean, uncluttered layout
-   **Soft Shadows**: Subtle elevation effects

---

## **Key Features**

### **1. Multi-Step Form UX**

-   Progress indicator at top of form
-   Smooth transitions between steps
-   Form validation with friendly error messages
-   Ability to go back to previous steps
-   Save progress locally (localStorage)

### **2. Referral System**

-   Generate unique referral codes (e.g., "SARAH2024")
-   Track referrals and improve waitlist positions
-   Social sharing with pre-populated messages
-   Referral leaderboard (optional)

### **3. Payment Integration**

-   Stripe Setup Intent (no immediate charge)
-   Clear messaging about payment timing
-   Professional payment form with validation
-   Secure customer creation

### **4. Mobile-First Design**

-   Responsive across all devices
-   Touch-friendly form elements
-   Fast loading on mobile networks
-   Swipe gestures for form steps

---

## **API Endpoints**

### **Form Submission**

-   `POST /api/signup` - Multi-step form submission
-   `GET /api/position/:email` - Get waitlist position
-   `POST /api/referral` - Process referral code

### **Stripe Integration**

-   `POST /api/stripe/setup-intent` - Create payment setup
-   `POST /api/stripe/confirm` - Confirm payment method

---

## **Content Integration**

### **Hero Section**

-   Background: Diverse women in elevated setting
-   Headline: "BUILD YOUR BEST LIFE"
-   Subheading: "Through curated events, career connections, and powerful community. Your new circle starts here."
-   CTA: Pink "Join the Waitlist" button

### **Benefits Section**

-   "THIS ISN'T JUST A MEMBERSHIP. IT'S YOUR ADVANTAGE."
-   Three main value props with icons
-   Emphasis on community + opportunity

### **Form Section**

-   "LET'S GET TO KNOW YOU"
-   "Apply now to join the BB Membership waitlist"
-   "(No commitment. 3-month minimum if accepted.)"

---

## **Deliverables**

1. **Complete Next.js Landing Page**

    - Hero section with provided copy
    - Multi-step form implementation
    - Responsive design matching aesthetic
    - Stripe payment integration

2. **Database Setup**

    - Supabase configuration
    - Table creation and relationships
    - Data validation and security

3. **Referral System**

    - Code generation and tracking
    - Position calculation logic
    - Social sharing functionality

4. **Admin Dashboard (Simple)**

    - Basic user list and export
    - Waitlist analytics
    - Manual position adjustments

5. **Squarespace Integration**
    - Instructions for embedding full page
    - Custom domain setup if needed
    - Mobile optimization testing

---

This simplified approach gives you a **beautiful, conversion-optimized waitlist** specifically designed for BB Membership, with the feminine aesthetic and smooth UX you're looking for, while maintaining the core referral functionality to drive viral growth.

---

Based on the image you've shared and our previous conversation about the BB Membership waitlist, I can see you want a clean, modern user dashboard design. Here's how we can implement this aesthetic for your waitlist landing page:

## **User Dashboard Design Specifications**

### **Visual Style (Based on Image)**

-   **Clean, minimal layout** with plenty of white space
-   **Soft color palette** with subtle pastels
-   **Card-based components** with gentle shadows
-   **Rounded corners** (8-12px border radius)
-   **Modern typography** with good hierarchy
-   **Soft gradients** and gentle transitions

### **Dashboard Layout Structure**

#### **Header Section**

```
┌─────────────────────────────────────────────────────────┐
│ 🌸 Welcome back, Sarah!                                 │
│ You're building something amazing.                       │
└─────────────────────────────────────────────────────────┘
```

#### **Main Dashboard Cards**

```
┌─────────────────────────────────────────────────────────┐
│                 YOUR WAITLIST STATUS                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│              Position #247                              │
│           out of 1,247 members                          │
│                                                         │
│        ████████████████░░░░                            │
│              Top 20%                                    │
│                                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                 SHARE & CLIMB                           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Your referral code: SARAH2024                          │
│  ┌─────────────────────────────────────────────────────┐ │
│  │ https://bb.com/join?ref=SARAH2024    [Copy Link]   │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                         │
│  Share with friends:                                    │
│  [Instagram] [WhatsApp] [Text] [Email]                  │
│                                                         │
│  👥 3 friends joined • 2 more = move up 10 spots       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### **Color Palette (Soft & Feminine)**

-   **Primary**: #FF6B9D (Brand Pink)
-   **Background**: #FEFEFE (Pure White)
-   **Card Background**: #F8F9FA (Very Light Gray)
-   **Soft Pink**: #FFE5ED (Light Pink Accents)
-   **Soft Blue**: #E3F2FD (Gentle Blue)
-   **Text Primary**: #2D3436 (Dark Gray)
-   **Text Secondary**: #636E72 (Medium Gray)
-   **Success**: #00B894 (Soft Green)

### **Typography & Spacing**

-   **Header**: 32px, bold, #2D3436
-   **Subheader**: 18px, regular, #636E72
-   **Body**: 16px, regular, #2D3436
-   **Cards**: 24px padding, 16px margin between cards
-   **Line Height**: 1.6 for readability

### **Interactive Elements**

-   **Buttons**: Soft rounded (12px), subtle hover effects
-   **Copy Button**: Smooth success animation
-   **Social Buttons**: Gentle hover with brand colors
-   **Progress Bar**: Animated, soft gradient fill

### **Mobile-First Responsive**

-   **Stacked cards** on mobile
-   **Larger touch targets** (48px minimum)
-   **Swipe gestures** for sharing
-   **Bottom padding** for mobile keyboards

### **Micro-interactions**

-   **Fade-in animations** for cards loading
-   **Success feedback** for copy actions
-   **Smooth transitions** between states
-   **Gentle pulse** for important CTAs

### **Dashboard Components**

#### **Progress Visualization**

```jsx
// Position Progress Component
<div className="bg-gradient-to-r from-pink-50 to-blue-50 p-6 rounded-2xl">
    <div className="text-center">
        <h3 className="text-3xl font-bold text-gray-800">Position #247</h3>
        <p className="text-gray-600">out of 1,247 members</p>
        <div className="mt-4 bg-gray-200 rounded-full h-3 overflow-hidden">
            <div className="bg-gradient-to-r from-pink-400 to-pink-500 h-full rounded-full" style={{ width: '80%' }}></div>
        </div>
        <p className="mt-2 text-sm font-medium text-pink-600">Top 20%</p>
    </div>
</div>
```

#### **Referral Sharing Card**

```jsx
// Referral Component
<div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
    <h3 className="text-xl font-semibold mb-4">Share & Climb</h3>

    <div className="bg-gray-50 p-4 rounded-xl mb-4">
        <p className="text-sm text-gray-600 mb-2">Your referral code:</p>
        <div className="flex items-center justify-between bg-white p-3 rounded-lg">
            <code className="font-mono text-pink-600 font-semibold">SARAH2024</code>
            <button className="text-pink-500 hover:text-pink-600">Copy</button>
        </div>
    </div>

    <div className="flex gap-2 justify-center">
        <SocialButton platform="instagram" />
        <SocialButton platform="whatsapp" />
        <SocialButton platform="text" />
        <SocialButton platform="email" />
    </div>

    <p className="text-center text-sm text-gray-600 mt-4">👥 3 friends joined • 2 more = move up 10 spots</p>
</div>
```

This design matches the clean, soft aesthetic from your reference image while maintaining the functionality needed for your BB Membership waitlist. The layout prioritizes user engagement with clear progress visualization and easy referral sharing, perfect for driving the viral growth you want for your women's community platform.

Would you like me to detail any specific component or adjust any aspect of this design?

## The copywriting doc from the client:

BB MEMBERSHIP WAITLIST LANDING PAGE
This isn’t just your social life—it’s your success network.
HERO SECTION
Background Image: Elevated, high-energy group of women—maybe post-workout, at dinner, or laughing at a panel event. Diverse, ambitious, magnetic.
Overlay Text (centered):
BUILD YOUR BEST LIFE
Through curated events, career connections, and powerful community.
Your new circle starts here.
CTA Button:
[ Join the Waitlist ] — brand highlight color (pink)

THIS ISN’T JUST A MEMBERSHIP. IT’S YOUR ADVANTAGE.
The Brickell Babes is the ultimate platform for ambitious, socially curious women who want it all: community, opportunity, and connection.
Whether you're launching your brand, changing careers, or simply looking to level up your circle, this is where high-vibe friendships and strategic networking meet.
CTA Button: Explore Member Benefits

WHAT CAN I EXPECT FROM THE WAITLIST?
Due to demand, memberships are released in waves based on waitlist priority.
There’s zero commitment to join.
Referrals = Priority Access

Share your unique link to move up the list and gain early access to exclusive programming.

WHAT DOES MEMBERSHIP INCLUDE?

1. BB CIRCUIT: SOCIAL + STRATEGIC EVENTS
   Use your credits to unlock 8–12 curated experiences per month:
   Rooftop happy hours & sculpting workouts
   Curated networking dinners with founders, creatives, and execs
   Finance & business talks (investing, Bitcoin, tax strategy, real estate, and entrepreneurship)
   Wellness & Mindfulness sessions to recharge and reconnect
   Think: ClassPass meets your dream mentor group.

2. DIGITAL PLATFORM: YOUR PRIVATE NETWORK
   Connect with women who get you in a safe, curated space:
   Create a member profile (age, industry, neighborhood, interests)
   Filter by job title, shared goals, or past event attendance
   Direct chat with members pre/post events
   Discover likeminded women (like Bumble BFF, but better)
   Join subgroups: Women in Tech, Creators, Founders, Bitcoin Babes, New Moms
   Community forum with anonymous posting + AI bot (Brickette)
   Think: LinkedIn meets Reddit meets your group chat.

3. PERKS: GIFTS, DEALS & PRIORITY ACCESS
   Unlock hundreds in local & national value each month:
   FITNESS
   2 weeks unlimited at Pure Barre
   5-class pack at OneTribe
   1 week free at Legacy Fitness
   1 week free at SoulCycle

DINING & LIFESTYLE
10% off at Maman
15% off Carrot Express
Free dessert/cocktail at Groot restaurants
VIP booking at Riviera Dining Group spots
BUSINESS & ENTREPRENEURSHIP
Open up a free LLC with XYZ (a $298 value)
1:1 startup legal consult or contract review (from a vetted partner law firm)
Discount on trademark filing through a legal partner
25% off business insurance setup
6 months free of Canva Pro
6 months free of Notion Plus
20% off Squarespace
1 month free of Flodesk
BEAUTY & BRANDING
Exclusive packages at Surface Level
Media & content perks for business owners
BB collab opportunities for tastemakers and creators
Think: American Express perks, but made for your Miami lifestyle.

LEVEL UP YOUR NETWORK
We’re not just brunch and beach days. BB is your unfair advantage.
Find a mentor.
Meet future cofounders.
Get your finances right.
Build your brand with women who want to see you win.

LET’S GET TO KNOW YOU
Apply now to join the BB Membership waitlist.
(No commitment. 3-month minimum if accepted.)
[ Form Fields ]
First Name
Last Name
Date of Birth
Email
Instagram Handle
LinkedIn Link
Age Range (dropdown)
20s
30s
40s
50s
60s+
Neighborhood (dropdown or text field)
Brickell
Coconut Grove
Coral Gables
Edgewater or Midtown
South Beach
Sunset Harbor
Miami Beach
Fort Lauderdale
Boca Raton
Palm Beach
Other (please list)

Occupation / Industry
(blank text box)

What are you most excited about?
Social Events & Fitness
Networking & Mentorship
Business & Finance Talks
Member Perks & Discounts

✅ Checkbox:
Keep me in the loop about events and early access.
[ Join Waitlist Button ]

👑 MEMBERSHIP TIERS (PREVIEW)
Tier
Monthly
Credits
Perks
Basic
$38
1
Access to events + platform
Insider
$68
3
Guest passes
Tastemaker
$148
7
Guest passes
Founder
$298
Unlimited
curated gift bag with annual contract

📝 3-month minimum commitment required.

💬 MEMBER REVIEWS
“The women I’ve met here helped me launch my business. Literally.”
– Danielle, 32, South Beach
“Between the events, perks, and mentorship, I got more out of this than my MBA.”
– Sam, 34, Downtown Miami
“I found my people, my gym, and my dream client, all in the first month.”
– Ava, 29, Brickell

👣 FOOTER
Learn: Waitlist Info | Events | Press
About: Our Story | Join as an Ambassador | Partner With Us
Support: FAQ | Contact
Legal: Privacy Policy | Terms
Newsletter Signup: [email field]
Social Icons: Instagram | Facebook | LinkedIn

----------------------------

EXPLORE MEMBER BENEFITS
Your life. Leveled up.
Break this into clear, elevated categories — a mix of tangible perks and aspirational results.

SOCIAL LIFE, REIMAGINED
Say goodbye to awkward meetups and random group chats.
Tap into a curated calendar of high-vibe, high-impact experiences built for connection.
Monthly events you actually want to go to
Boutique fitness, rooftop happy hours, and sculpting workouts
Invite-only networking dinners and cofounder meetups
Priority access to members-only activations
Credit-based event system (like ClassPass but for your social life)
Meet new friends, business partners, and workout buddies, all effortlessly.

CAREER & BUSINESS SUPPORT
Whether you’re pivoting, launching, or scaling—we’ve got you.
Free or discounted LLC registration + biz formation support
Legal + accounting partner perks (trademark help, bookkeeping, tax prep)
Resume audits, LinkedIn refreshes, and job board access
Personal branding & pitch deck templates
Founder-specific group chats + visibility opportunities (podcasts, press, panels)
Build your dream job, brand, or business—faster and with less friction.

PERSONAL FINANCE & INVESTING
Because financial confidence = freedom.
Monthly talks on investing, budgeting, taxes, and entrepreneurship
Bitcoin wallet setup & investing education
Bookkeeping and accounting partner discounts
Learn to manage your money like a CEO, even if you’re just getting started.

PRIVATE DIGITAL PLATFORM
Your curated network, one click away.
Skip the noise of Facebook, WhatsApp, and Instagram DMs.
Filtered member profiles by industry, age, vibe, and interests
1:1 direct chat and pre/post-event threads
Community forum with subgroups (Founders, Moms, Tech, Creators)
Anonymous posting + AI-powered chat bot (Brickette)
Create your digital calling card to get discovered + build trust
Connect, collaborate, and grow without leaving the BB ecosystem.

INSANE PERKS & VIP ACCESS
Thousands in annual value. Miami-tested, member-approved.
Discounted coffee, exclusive workouts, premium booking access
Monthly perks at Miami’s best restaurants, gyms, and beauty spots
Early access to collabs, retreats, and pop-ups
Live like a local insider with a luxury twist.

GROWTH THAT ACTUALLY STICKS
This isn’t just about networking. It’s about becoming your best self.
Events that inspire real connection, not just surface convos
Wellness integrations: breathwork, mindset coaching, longevity workshops
Branding yourself like a pro (with feedback from the BB community)
Meet women who challenge, cheerlead, and connect you to your next move
Optional accountability pods to help you hit personal + professional goals
You don’t need a coach or another course. You need the right circle.

Sample CTA:
Whether you're new in town, entering your career-girl era, or ready to uplevel, Brickell Babes is here to help you find your people and build your path.

----------------------

HOW CREDITS WORK
Think of credits as your passport to the BB experience.

What Are Credits?
Credits are the currency of your BB Membership.
They give you access to curated events, experiences, and perks throughout the month — from sweat sessions and rooftop happy hours to professional dinners and private workshops.
Every event has a credit value. You use your monthly credits to reserve your spot.

What Kinds of Events Can I Use Them On?
Credits can be used for:
Credit Range
Example Events
1 Credit
Happy hours, group fitness class, networking
2 Credits
Business workshops, lunch & learn series, experiences
3–5 Credits
Private dining experiences, VIP events

Some events may allow guests with an extra credit or small upgrade fee.

How Many Credits Do I Get?
Tier
Monthly Credits
Highlights
Basic
1 Credit
Access to core events & discounted add-ons
Insider
3 Credits
Most popular tier — balance of fun + access
Tastemaker
7 Credits
Guest passes + premium perks
Founder
Unlimited Credits
All-access pass + VIP-only invites

What If I Run Out of Credits?
No stress — you can:
Buy additional credits à la carte anytime
Upgrade your membership tier for more included credits
Use referral bonuses

Do Credits Roll Over?
Credits reset monthly on your billing date
Unused credits do not roll over, but you can always upgrade for more flexibility

Why Credits?
Using credits keeps the experience flexible, fair, and rewarding.
Whether you're in a social season or a recharge era, you’re never paying for what you don’t use.
The more active you are, the more value you unlock.
And you’ll always know exactly what you’re getting each month.

BB Tip:
Want to attend multiple events in one week? Choose a higher tier or plan ahead using your monthly drop.

Popular events fill fast — book early and get rewarded.
