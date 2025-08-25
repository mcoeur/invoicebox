# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an invoice box application built with Next.js and SQLite.

## Guidelines

Use all information in the file CONTEXT.md for a basic understanding of the project.

## Development Commands

Navigate to the `invoicebox-app` directory first:

```bash
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Architecture Notes

The invoice management application is built with:

### Backend Structure

- **Database**: SQLite with schema in `src/lib/database.ts`
- **Services**: Client and Document services in `src/lib/services/`
- **API Routes**: RESTful endpoints in `src/app/api/`
- **Types**: TypeScript interfaces in `src/types/index.ts`

### Frontend Structure

- **Pages**: App Router structure with pages for clients, quotes, invoices, and documents
- **Styling**: Tailwind CSS for responsive design

### Key Features

- Client management (CRUD operations)
- Quote and invoice creation with auto-numbering (YYYYMM-XXXX format)
- Section-based billing with multiple units (day/hour/mission)
- Automatic VAT calculation and totals
- Document viewing and printing functionality

### Database Schema

- `clients`: Client information and addresses
- `documents`: Quotes and invoices with metadata
- `document_sections`: Line items for each document
- `document_counters`: Auto-incrementing counters for document numbers

## Development Guidelines

- Stick to the approved technology stack (Next.js, SQLite)
- Request permission before adding new dependencies or technologies
- Update AGENTS.md when new technologies are approved and added
