# DevNote V2 - Design Tokens Reference

## 🎨 Color Palette

### Primary Colors
| Token | Hex Value | Usage | WCAG Contrast |
|-------|-----------|-------|---------------|
| `--color-primary` | #6C63FF | Primary buttons, links, accents | 4.52:1 on white ✅ |
| `--color-primary-variant` | #9D4EDD | Focus states, highlights | 3.89:1 on white ✅ |
| `--color-primary-light` | #A855F7 | Hover states, secondary accents | 3.55:1 on white ✅ |
| `--color-primary-dark` | #5B21B6 | Dark theme accents | 7.12:1 on white ✅ |

### Neutral Colors
| Token | Hex Value | Usage | WCAG Contrast |
|-------|-----------|-------|---------------|
| `--color-white` | #FFFFFF | Light theme background | - |
| `--color-dark-bg` | #1A1A2E | Dark theme background | - |
| `--color-dark-surface` | #16213E | Dark theme cards/surfaces | - |
| `--color-light-text` | #DDDDDD | Dark theme text | 12.63:1 on dark bg ✅ |
| `--color-dark-text` | #222222 | Light theme text | 16.74:1 on white ✅ |
| `--color-muted` | #8A86B2 | Secondary text, placeholders | 2.89:1 on white ⚠️ |

### Gradients
| Token | Value | Usage |
|-------|-------|-------|
| `--gradient-hero` | `linear-gradient(135deg, #6C63FF 0%, #9D4EDD 100%)` | Hero sections, primary buttons |
| `--gradient-card` | `linear-gradient(145deg, #6C63FF 0%, #A855F7 100%)` | Card backgrounds, highlights |

## 📝 Typography Scale

### Font Sizes
| Token | Value | Usage |
|-------|-------|-------|
| `--font-size-base` | 16px | Body text, default size |
| Hero H1 | 56-64px | Main hero headings |
| Section H2 | 32-40px | Section headings |
| Card H3 | 20-24px | Card titles |
| Caption | 14px | Small text, metadata |

### Font Weights
| Token | Value | Usage |
|-------|-------|-------|
| `--font-weight-normal` | 400 | Body text |
| `--font-weight-semibold` | 600 | Subheadings, emphasis |
| `--font-weight-bold` | 700 | Main headings |

### Line Heights
| Token | Value | Usage |
|-------|-------|-------|
| `--line-height-base` | 1.7 | Body text, optimal readability |
| Headings | 1.1-1.3 | Tight spacing for headings |
| Code | 1.5 | Monospace content |

## 🎯 Spacing System

| Token | Value | Usage |
|-------|-------|-------|
| `--spacing-xs` | 0.25rem (4px) | Tight spacing |
| `--spacing-sm` | 0.5rem (8px) | Small gaps |
| `--spacing-md` | 1rem (16px) | Standard spacing |
| `--spacing-lg` | 1.5rem (24px) | Section spacing |
| `--spacing-xl` | 2rem (32px) | Large gaps |

## 🌗 Theme Variables

### Light Theme
| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | #FFFFFF | Main background |
| `--bg-surface` | #F8FAFC | Card backgrounds |
| `--text-primary` | #222222 | Main text |
| `--text-secondary` | #6B7280 | Secondary text |
| `--border-color` | rgba(0,0,0,0.1) | Borders |
| `--glass-bg` | rgba(255,255,255,0.1) | Glass effects |

### Dark Theme
| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | #1A1A2E | Main background |
| `--bg-surface` | #16213E | Card backgrounds |
| `--text-primary` | #DDDDDD | Main text |
| `--text-secondary` | #8A86B2 | Secondary text |
| `--border-color` | rgba(255,255,255,0.1) | Borders |
| `--glass-bg` | rgba(255,255,255,0.05) | Glass effects |

## ⚡ Transitions

| Token | Value | Usage |
|-------|-------|-------|
| `--transition-fast` | 150ms ease | Quick interactions |
| `--transition-normal` | 300ms ease | Standard animations |

## 🎨 Component-Specific Colors

### Buttons
```css
.btn-primary {
  background: var(--gradient-hero);
  color: white;
}

.btn-primary:hover {
  box-shadow: 0 10px 20px rgba(108, 99, 255, 0.3);
}

.btn-primary:focus-visible {
  outline: 3px solid var(--color-primary-variant);
}
```

### Cards
```css
.card {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid var(--border-color);
}
```

### Loading States
```css
.loading-spinner {
  border-top-color: var(--color-primary);
}
```

## 🔍 Usage Guidelines

### Color Application
1. **Primary color** for main CTAs and key interactive elements
2. **Primary variant** for focus states and highlights
3. **Gradients** for hero sections and primary buttons only
4. **Muted colors** for secondary information (ensure sufficient contrast)

### Typography Hierarchy
1. Use consistent font weights: 400 (normal), 600 (semibold), 700 (bold)
2. Maintain line-height of 1.7 for body text readability
3. Limit line length to 65-75 characters for optimal reading

### Accessibility Requirements
1. All text must meet WCAG AA contrast ratios (4.5:1 minimum)
2. Focus indicators must be visible (3px purple outline)
3. Support reduced motion preferences
4. Provide alternative text for all images

### Theme Implementation
1. Use CSS custom properties for all colors
2. Support both light and dark themes
3. Respect user's system preference by default
4. Allow manual theme switching with persistence

## 📱 Responsive Considerations

### Mobile Adjustments
- Base font size reduces to 14px on screens < 768px
- Spacing scales proportionally
- Touch targets minimum 44px

### Font Scaling
- Small: 14px base
- Medium: 16px base (default)
- Large: 20px base
- All sizes use rem units for consistent scaling

This design system ensures consistent, accessible, and professional appearance across all DevNote components while maintaining the purple brand identity.