# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Versioning Policy

This project follows Semantic Versioning (SemVer) for both the **Widget SDK** and **Dashboard**.

### Version Format: MAJOR.MINOR.PATCH

- **MAJOR**: Breaking changes to the API or SDK interface
- **MINOR**: New features added in a backward-compatible manner
- **PATCH**: Bug fixes and non-breaking improvements

### Release Cycle

- **Dashboard**: Released with each production deployment
- **Widget SDK**: Versioned independently; breaking changes require major version bump

### Breaking Changes

Breaking changes include:
- Removal or renaming of public APIs
- Changes to event schemas (e.g., `STARGATE_LOADED`, `STARGATE_PAID`, `STARGATE_ERROR`)
- Changes to `postMessage` protocol or origin validation
- Modifications to CSS variable names or structure

### Deprecation Policy

Features marked as deprecated will be supported for at least one major version before removal.

---

## [Unreleased]

### Added
- Initial changelog and versioning policy documentation

### Changed

### Deprecated

### Removed

### Fixed

### Security

---

## [1.0.0] - 2026-05-22

### Added
- Initial release of Stargate Frontend
- Widget SDK with Freighter and Albedo wallet support
- Merchant dashboard with payment links and invoicing
- Webhook management and delivery logs
- Team management and role-based access control
- Payment analytics and revenue tracking
- Dispute management system
- Testnet and mainnet support for Stellar network

### Security
- Content Security Policy (CSP) headers for hosted checkout
- postMessage origin validation for widget communication
- XSS prevention through input sanitization
