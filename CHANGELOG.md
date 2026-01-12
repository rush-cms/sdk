# Changelog

All notable changes to the Rush CMS SDK will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-01-12

### Added

#### i18n Native Support
- **@rushcms/types**
  - New locale types: `SupportedLocale`, `LocaleConfig`, `LocaleAwareRequest`, `LocaleAwareResponse`
  - `LOCALE_NAMES` constant mapping locale codes to display names
  - `Collection` interface for collection metadata

- **@rushcms/client**
  - `locale` configuration option with `default` and `fallback` settings
  - `setLocale(locale)` method to change current locale
  - `getLocale()` method to get current locale
  - Automatic `Accept-Language` header in all API requests
  - All API methods now accept optional `locale` parameter to override context locale
  - New `getCollections(locale?)` method

- **@rushcms/react**
  - `LocaleProvider` component for managing locale context
  - `useLocale()` hook to access and change locale
  - `LocaleSwitcher` component for easy locale switching UI
  - All hooks (`useEntry`, `useEntries`, `useNavigation`, etc.) now support optional `locale` parameter

#### TipTap Content Editor Support
- **@rushcms/types**
  - Complete TipTap node types: `TipTapContent`, `TipTapNode`, `TipTapMark`
  - Support for all standard TipTap nodes: paragraph, heading, lists, tables, code blocks, blockquotes
  - Custom block types: `TipTapYoutubeBlock`, `TipTapGalleryBlock`, `TipTapGenericCustomBlock`
  - `ContentFormat` union type supporting both `Block[]` and `TipTapContent`

- **@rushcms/react**
  - `TipTapRenderer` component to render TipTap content
  - `TipTapNodeRenderer` component for individual node rendering
  - `ContentRenderer` component with automatic format detection
  - `useContentFormat()` hook to detect content format
  - Full support for all TipTap marks: bold, italic, underline, strike, code, link, highlight, subscript, superscript
  - Custom block rendering for YouTube embeds and image galleries

### Changed

#### Breaking Changes

**API Responses**
- `getEntry()` now returns only the requested locale instead of all available locales
- `Navigation.items.collection_id` removed - use `Navigation.items.collection.id` instead
- `Entry` interface now has separate `categories` field (previously grouped with `tags`)
- `Entry.data.content` type changed from `Block[]` to `Block[] | TipTapContent` to support both formats

**Type Changes**
- `Tag` interface now includes `type` field (`'tag'` | `'category'`)
- `Tag` interface now includes `entries_count` field
- `EntriesQueryParams` expanded with new filter options: `category`, `categories`

**React Components**
- `RushCMSProvider` automatically wraps children with `LocaleProvider`
- All hooks that fetch data now require `LocaleProvider` in component tree
- Hooks accept `locale` parameter that overrides context locale

### Migration Guide

See [MIGRATION-GUIDE.md](./MIGRATION-GUIDE.md) for detailed migration instructions.

### Fixed
- Improved TypeScript type safety across all packages
- Better error handling for invalid content formats

### Deprecated
- `BlockRenderer` is not deprecated but `ContentRenderer` is now recommended for automatic format detection

---

## [1.x] - Previous versions

For changes in version 1.x, please refer to the git history.
