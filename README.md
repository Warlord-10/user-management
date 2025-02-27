# User Management System

A comprehensive user management system built with Next.js, featuring role-based access control, tenant management, and authentication.

## Features

### Authentication
- Multiple authentication methods:
  - Email/Password
  - Google OAuth
  - GitHub OAuth
- Email verification system
- Secure session management using NextAuth.js

### Role-Based Access Control
- Super User access
- Admin privileges
- Tenant-based roles:
  - Owner
  - Manager
  - Member

### User Management
- User profile management
- Email verification
- Password reset

### Tenant Management
- Role assignment and management
- Team member management within tenants

## System Architecture

### Authentication Flow
1. Users can register using email/password or OAuth providers
2. Email verification required for email/password registration
3. Session-based authentication using NextAuth.js
4. Protected routes with server-side session validation

### Role Management
1. Global Roles:
   - Super User: Full system access, supervision. Has the ability to assign roles to users, create tenants, and manage global roles.
   - Admin: A special form of owner, with the ability to create new tenants.

2. Tenant-Based Roles:
   - Owner: Full tenant control (is also an admin)
   - Manager: Enhanced member privileges with tenant management and role assignment
   - Member: Basic tenant access

### Data Model
- User: Stores user information and global roles
- Member: Manages tenant-user relationships and roles
- Tenant: Represents organization/team structure

## Technical Stack

- **Frontend**: Next.js 15.1
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **UI Components**: 
  - Radix UI
  - Tailwind CSS
  - Lucide React Icons
- **Email Service**: Nodemailer

## Environment Setup

Required environment variables:

```env
MONGODB_URI=your_mongodb_connection_string
NEXT_PUBLIC_BASE_URL=your_application_url

# Authentication Providers
GITHUB_ID=your_github_oauth_id
GITHUB_SECRET=your_github_oauth_secret
GOOGLE_CLIENT_ID=your_google_oauth_id
GOOGLE_CLIENT_SECRET=your_google_oauth_secret

# Email Configuration (for verification)
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_USER=your_smtp_username
SMTP_PASSWORD=your_smtp_password
```

## Notes
- Super User can only be created manually, not through the system.
- For testing purpose a super user is already created. The credentials are:
  - Name: Admin
  - Email: admin@gmail.com
  - Password: admin1234
- This email is manually set to verified.
