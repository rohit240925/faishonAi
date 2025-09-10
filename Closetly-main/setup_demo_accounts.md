# Demo Accounts Setup Guide

This guide helps you set up demo accounts for testing the FashionGen application.

## 🎭 Demo Account Credentials

### Admin Demo Account
- **Email:** `admin@fashiongen.demo`
- **Password:** `admin123`
- **Role:** Administrator
- **Credits:** 10,000 API credits
- **Features:** 
  - Full administrative access
  - Advanced dashboard and analytics
  - User management capabilities
  - Unlimited storage (10GB)

### Customer Demo Account
- **Email:** `customer@fashiongen.demo`  
- **Password:** `customer123`
- **Role:** Customer
- **Credits:** 300 API credits
- **Features:**
  - Professional subscription plan
  - Standard fashion generation features
  - Portfolio management
  - 1GB storage limit

## 🚀 Setup Methods

### Method 1: Automatic Setup (Recommended)

The demo accounts are created automatically when you run the Supabase migrations:

1. **Deploy migrations to Supabase:**
   ```bash
   supabase db push
   ```

2. **Or run specific migration:**
   ```sql
   -- In Supabase SQL Editor, run:
   -- /supabase/migrations/20250109000000_create_demo_accounts.sql
   ```

### Method 2: Manual Setup

If you need to create the accounts manually:

1. **Run the manual setup script:**
   ```sql
   -- In Supabase SQL Editor, run the contents of:
   -- create_demo_accounts.sql
   ```

2. **Or create via Supabase Dashboard:**
   - Go to Authentication > Users
   - Add new users with the credentials above
   - Set up their profiles manually

## 🧪 What's Included

The demo accounts come pre-populated with:

### Sample Data
- **Fashion Portfolio Images:** Example generated content
- **API Usage Logs:** Realistic usage patterns  
- **Payment History:** Sample transaction records
- **Subscription Data:** Active Professional plan for customer

### Realistic Scenarios
- **Admin Account:** High usage, administrative activities
- **Customer Account:** Typical user behavior, active subscription

## 🔧 Customization

You can modify the demo accounts by:

1. **Editing the migration file:**
   ```
   /supabase/migrations/20250109000000_create_demo_accounts.sql
   ```

2. **Updating credentials:**
   - Change email addresses
   - Modify passwords (remember to hash them)
   - Adjust credit amounts

3. **Adding more sample data:**
   - Additional portfolio images
   - More API usage logs
   - Different subscription plans

## 🛡️ Security Notes

> **⚠️ Important for Production:**
> - Remove or disable demo accounts in production
> - Use strong, unique passwords
> - Consider using environment variables for credentials
> - Regularly rotate demo account passwords

## 🔍 Troubleshooting

### Demo Accounts Not Working?

1. **Check if migration ran successfully:**
   ```sql
   SELECT email FROM auth.users WHERE email LIKE '%@fashiongen.demo';
   ```

2. **Verify user profiles exist:**
   ```sql
   SELECT email, role, current_api_credits FROM user_profiles 
   WHERE email LIKE '%@fashiongen.demo';
   ```

3. **Reset passwords if needed:**
   - Use Supabase Dashboard > Authentication > Users
   - Click on user and reset password

### Can't Login?

1. **Check email confirmation settings** in Supabase Dashboard
2. **Verify RLS policies** allow access to demo users
3. **Check browser console** for authentication errors

## 📞 Support

If you encounter issues with the demo accounts:

1. Check the Supabase logs for errors
2. Verify all environment variables are set
3. Ensure database migrations completed successfully
4. Review the authentication configuration

---

**Happy Testing!** 🎨✨

The demo accounts provide a full-featured experience of the FashionGen platform, allowing you to explore all capabilities without setting up real user accounts.