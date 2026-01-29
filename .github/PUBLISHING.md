# Publishing Guide for rde-common

This document explains how to publish rde-common to npm using GitHub Actions workflows.

## Prerequisites

1. **npm Account**: Make sure you have an npm account at https://www.npmjs.com
2. **npm Token**: Generate a personal access token (PAT) from npm with publish permissions
3. **GitHub Secret**: Add the npm token as a repository secret named `NPM_TOKEN`

### Setting up npm Token

1. Go to https://www.npmjs.com/settings/tokens
2. Click "Generate New Token"
3. Choose "Granular Access Token"
4. Grant permissions:
   - `Publish` for packages you own and unscoped packages
   - `Read > Publish > Create > Modify` scopes
5. Copy the generated token
6. Add it to your GitHub repository secrets as `NPM_TOKEN`

## Publishing Methods

### Method 1: Automatic Tag-Based Publishing (Recommended)

When you push a git tag matching the pattern `v*.*.*`, the workflow automatically publishes to npm.

```bash
# Ensure package.json has the correct version
npm version patch  # or minor/major

# Push the version commit and tag
git push origin main --follow-tags

# The workflow will automatically publish to npm
```

**Advantages:**
- Fully automated
- Creates GitHub releases automatically
- Single source of truth (git tag)

### Method 2: Manual Publishing via Workflow Dispatch

Use the manual publish workflow for fine-grained control.

1. Go to GitHub Actions → "Publish to npm" workflow
2. Click "Run workflow"
3. Enter:
   - **Version**: The version to publish (e.g., `1.0.0` or `1.0.0-beta.1`)
   - **Tag**: npm tag (default: `latest`; use `beta` for prerelease versions)
4. Click "Run workflow"

**Advantages:**
- Can publish with custom versions
- Can use npm tags (e.g., `beta`, `alpha`)
- Good for hotfixes and prereleases

### Method 3: Manual Publish from Local Machine

```bash
# Build and test locally
npm run build
npm test

# Publish to npm
npm publish

# Create GitHub release manually if desired
gh release create v1.0.0 --generate-notes
```

## Workflows

### ci.yml
- **Trigger**: Push to main/master/develop, Pull Requests, Manual dispatch
- **Actions**:
  - Tests on Node.js 18, 20, and 22
  - Builds the package
  - Runs tests and generates coverage reports
  - Uploads coverage to Codecov
- **Status Badge**: Shows in PR checks

### publish.yml
- **Trigger**: Manual workflow dispatch
- **Actions**:
  - Publishes specific version to npm
  - Allows custom npm tags (latest, beta, alpha, etc.)
  - Creates GitHub release
  - Verifies package.json version matches input

### tag-release.yml
- **Trigger**: Push of git tags matching `v*.*.*` pattern
- **Actions**:
  - Automatically publishes to npm
  - Verifies version consistency
  - Creates GitHub release with changelog
  - **Recommended for production releases**

## Version Management

### Semantic Versioning

Follow [Semantic Versioning](https://semver.org/):
- **MAJOR** (X.0.0): Breaking changes
- **MINOR** (0.X.0): New features, backwards compatible
- **PATCH** (0.0.X): Bug fixes, backwards compatible

### Using npm version

```bash
# Patch release (1.0.0 → 1.0.1)
npm version patch
yarn version patch

# Minor release (1.0.0 → 1.1.0)
npm version minor

# Major release (1.0.0 → 2.0.0)
npm version major

# Specific prerelease
npm version prerelease --preid=beta
```

### Manual Version Update

Edit `package.json` and update the `version` field:

```json
{
  "name": "rde-common",
  "version": "1.0.1"
}
```

## Prerelease Publishing

### Publishing Beta/Alpha Versions

**Option 1: Using tag-based workflow (requires matching version in package.json)**

```bash
# Update version in package.json to 1.1.0-beta.1
npm version prerelease --preid=beta

# Push tag
git push origin main --follow-tags

# Automatically publishes with npm tag "beta"
```

**Option 2: Using manual workflow dispatch**

1. Go to GitHub Actions → "Publish to npm"
2. Enter version: `1.1.0-beta.1`
3. Enter tag: `beta`

Users can install prerelease versions with:
```bash
npm install rde-common@beta
```

## Troubleshooting

### "npm ERR! Invalid authentication"
- Verify `NPM_TOKEN` is set in GitHub repository secrets
- Regenerate the npm token and update the secret

### "Version mismatch"
- Ensure `package.json` version exactly matches the tag version (without `v` prefix)
- Tag `v1.0.0` must have `"version": "1.0.0"` in package.json

### "publish not permitted"
- Check npm token has publish permissions
- Verify you're publishing to an organization/scope you own/have permissions for

### Workflow not triggering on tag push
- Ensure tag matches pattern `v*.*.*` (e.g., `v1.0.0`)
- Check branch protection rules don't block releases

## Release Checklist

- [ ] Update version in `package.json`
- [ ] Update CHANGELOG.md with release notes
- [ ] Ensure all tests pass: `npm test`
- [ ] Verify build succeeds: `npm run build`
- [ ] Commit changes: `git commit -am "Release v1.0.0"`
- [ ] Create git tag: `git tag v1.0.0` or `npm version patch`
- [ ] Push to GitHub: `git push origin main --follow-tags`
- [ ] Verify npm package appears at https://www.npmjs.com/package/rde-common
- [ ] Verify GitHub release created with changelog
- [ ] Announce release (Discord, Twitter, etc.)

## Additional Resources

- [npm Publishing Guide](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Semantic Versioning](https://semver.org/)
- [rde-common on npm](https://www.npmjs.com/package/rde-common)
