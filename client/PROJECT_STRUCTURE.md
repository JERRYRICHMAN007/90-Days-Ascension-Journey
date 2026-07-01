# Project Structure

This document describes the organized structure of the 90 Days Ascension Journey project.

## Directory Structure

```
90-Days-Ascension-Journey/
├── 90DaysAJ-frontend/          # React frontend application
│   ├── scripts/                # Development scripts (organized)
│   │   ├── start-dev.ps1
│   │   ├── start-dev.bat
│   │   └── README.md
│   ├── src/                    # Source code
│   ├── package.json
│   └── README.md
│
├── 90DaysAJ-backend/           # Node.js/Express backend API
│   ├── scripts/                # Utility scripts (organized)
│   │   ├── README.md
│   │   └── (scripts to be added here)
│   ├── src/                    # Source code
│   ├── prisma/                 # Database schema and migrations
│   ├── docker-compose.yml      # Docker configuration
│   ├── Dockerfile              # Docker image definition
│   ├── package.json
│   └── README.md
│
├── ENVIRONMENT_SETUP.md        # Environment configuration guide
├── README.md                   # Main project documentation
└── .gitignore                  # Git ignore rules
```

## Scripts Organization

### Frontend Scripts (`90DaysAJ-frontend/scripts/`)
- `start-dev.ps1` / `start-dev.bat` - Start development server

### Backend Scripts (`90DaysAJ-backend/scripts/`)
Scripts folder is set up and ready. Scripts should be placed here:
- `start-server.ps1` / `start-server.bat` - Start backend server
- `create-env.ps1` - Create .env file from template
- `check-supabase.ps1` - Check Supabase connection
- `test-auth.ps1` - Test authentication endpoints
- `ENV_TEMPLATE.txt` - Environment variables template

## Notes

- All scripts are organized in `scripts/` folders for better structure
- Documentation is consolidated in root and respective directories
- Configuration files (docker-compose.yml, Dockerfile, tsconfig.json) remain in their respective directories

## Files That May Need Attention

- `90DaysAJ-backend/90DaysSE-VitalFiles/` - Contains personal files (resume, COMFORT app curriculum) that may be unrelated to this project. Consider moving to a separate location or excluding from the repository.

