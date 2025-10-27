# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.3] - 2025-10-27

### Fixed
- **Credential Test Rules**: Added response validation rules to credential test for better n8n automated review compliance
- **Health Check Endpoint**: Corrected health check endpoint from `/predicts/health` to `/health` (requires authentication)

## [0.2.2] - 2025-10-27

### Added
- **Credential Test**: Added credential test using health check endpoint (`/health`) to validate API key during credential setup
- This is required for n8n community node approval and provides immediate feedback to users about credential validity

### Fixed
- **n8n Automated Review**: Fixed missing credential test requirement for n8n community node submission
- **Health Check Endpoint**: Corrected health check endpoint from `/predicts/health` to `/health` (requires authentication)

## [0.2.1] - 2025-10-15

### Fixed
- **Dark Mode Icon**: Properly configured dark mode icon support - node now displays correct icon in n8n's dark theme
- **Icon Configuration**: Updated from single icon string to object format with separate light and dark theme icons

### Changed
- **Credential Test Removed**: Removed credential test to avoid consuming user's API rate limits during setup. Credentials are now validated when the node is actually used, providing better user experience and preserving API quota.
- **Improved Credential Description**: Added helpful link to get API key and clearer messaging about validation timing

## [0.2.0] - 2025-10-15

### Added
- **AI Agent Tool Support**: Node can now be used as a tool for AI Agent nodes, enabling LLM models to perform sentiment analysis
- **Health Check Endpoint**: New Service resource with health check operation to monitor API availability
- **German Language Support**: Added German (de) as a supported language alongside English (en) and Dutch (nl)
- **Enhanced Entities Input**: Entities now use a structured list format with "Add Entity" button for better UX
- **LangChain Integration**: Added `@langchain/core` and `zod` as peer dependencies for AI Agent functionality

### Changed
- **API Request Format**: Updated to match Swagger specification exactly - language now sent as query parameter
- **API Response**: Now captures and returns `predicted_class` field along with existing fields
- **Entities Input**: Changed from comma-separated string to fixedCollection type for better structure and validation
- **Output Format**: Enhanced to include all API response fields (predicted_class, predicted_label, probabilities, details)

### Improved
- Better TypeScript type definitions for API responses
- Enhanced error handling for health check operations
- Improved AI Agent tool description for better LLM understanding
- More comprehensive output data for both regular and AI Agent usage

### Technical
- Refactored execute method to handle multiple resources (Document, Service)
- Added supplyData method for AI Agent integration
- Updated request structure to use query parameters for language selection
- Enhanced response processing to capture full API response structure

## [0.1.9] - 2025-10-14

### Changed
- Renamed icon files to `sentor-v2.svg` and `sentor-v2.dark.svg` to aggressively break all icon caching
- This should force n8n to load the new icons on all installations

## [0.1.8] - 2025-10-14

### Changed
- Updated node icons with improved, higher quality Sentor branding
- Enhanced visual clarity with better purple/blue Sentor logo
- Better visual representation in both light and dark modes

## [0.1.7] - 2025-10-14

### Changed
- Updated node icons with improved, higher quality Sentor branding (4.3KB vs previous 2.5KB)
- Better visual representation in both light and dark modes

## [0.1.6] - 2025-10-14

### Changed
- Updated node icons with improved Sentor branding
- Renamed icon files to `sentor-icon.svg` and `sentor-icon.dark.svg` to force n8n cache refresh
- Fixed tsconfig to prevent unnecessary files from being copied to dist folder

### Fixed
- Icon caching issue in n8n - new icon filenames ensure icons are properly loaded

## [0.1.5] - Previous Release

### Added
- Initial sentiment analysis functionality
- Support for English and Dutch languages
- Batch processing of multiple documents
- Simplified output option for easier integration
- Entity-level sentiment analysis

### Features
- Predict sentiment of text documents
- Configurable language selection
- Optional entity extraction
- Error handling with continue on fail support

