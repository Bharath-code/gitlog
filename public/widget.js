/**
 * GitLog Widget Script
 * 
 * Embed this script on your website to show a "What's New" widget
 * that displays your latest changelog entries.
 * 
 * Usage:
 * <script src="https://gitlog.app/widget.js" data-widget-id="your-widget-id" async></script>
 */

(function() {
  'use strict';

  // Get widget ID from script tag
  const script = document.currentScript || document.querySelector('script[data-widget-id]');
  const widgetId = script?.getAttribute('data-widget-id');

  if (!widgetId) {
    console.error('[GitLog Widget] Missing data-widget-id attribute');
    return;
  }

  // Default configuration
  const defaultConfig = {
    apiUrl: 'https://gitlog.app/api/widget',
    position: 'bottom-right',
    size: 'medium',
  };

  // Get configuration from script tag attributes
  const config = {
    apiUrl: script?.getAttribute('data-api-url') || defaultConfig.apiUrl,
    position: script?.getAttribute('data-position') || defaultConfig.position,
    size: script?.getAttribute('data-size') || defaultConfig.size,
  };

  // Create container for widget
  const container = document.createElement('div');
  container.id = 'gitlog-widget-container';
  document.body.appendChild(container);

  // Load React and ReactDOM from CDN (for lightweight embedding)
  // In production, you might want to use a pre-built bundle instead
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  async function initWidget() {
    try {
      // Fetch widget data
      const response = await fetch(`${config.apiUrl}/${widgetId}`);
      
      if (!response.ok) {
        throw new Error('Failed to load widget data');
      }

      const data = await response.json();
      const { config: widgetConfig, entries } = data;

      // Render widget using vanilla JS for better compatibility
      renderWidget(container, widgetConfig, entries);
    } catch (error) {
      console.error('[GitLog Widget] Error:', error);
      container.innerHTML = '';
    }
  }

  function renderWidget(container, config, entries) {
    const positionClasses = {
      'bottom-right': 'bottom: 1rem; right: 1rem;',
      'bottom-left': 'bottom: 1rem; left: 1rem;',
      'top-right': 'top: 1rem; right: 1rem;',
      'top-left': 'top: 1rem; left: 1rem;',
    };

    const sizeWidth = {
      small: '16rem',
      medium: '20rem',
      large: '24rem',
    };

    const positionStyle = positionClasses[config.position] || positionClasses['bottom-right'];
    const width = sizeWidth[config.size] || sizeWidth['medium'];

    // Create widget HTML
    const widgetHTML = `
      <div id="gitlog-widget" style="
        position: fixed;
        z-index: 9999;
        ${positionStyle}
        width: ${width};
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      ">
        <style>
          #gitlog-widget * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          
          #gitlog-widget-container-2 {
            background: ${config.colors.background || '#1a1a1d'};
            border: 1px solid rgba(255, 255, 255, 0.06);
            border-radius: 0.5rem;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            overflow: hidden;
          }
          
          #gitlog-widget-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.75rem 1rem;
            cursor: pointer;
            border-bottom: 1px solid rgba(255, 255, 255, 0.06);
            color: ${config.colors.text || '#fafafa'};
          }
          
          #gitlog-widget-header:hover {
            background: rgba(255, 255, 255, 0.02);
          }
          
          #gitlog-widget-title {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.875rem;
            font-weight: 600;
          }
          
          #gitlog-widget-badge {
            background: ${config.colors.primary || '#ff6b35'};
            color: white;
            padding: 0.125rem 0.5rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 500;
          }
          
          #gitlog-widget-chevron {
            width: 1rem;
            height: 1rem;
            color: rgba(255, 255, 255, 0.5);
          }
          
          #gitlog-widget-content {
            max-height: 24rem;
            overflow-y: auto;
          }
          
          #gitlog-widget-content.hidden {
            display: none;
          }
          
          .gitlog-entry {
            padding: 1rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.06);
            text-decoration: none;
            color: inherit;
            transition: background 0.2s;
          }
          
          .gitlog-entry:hover {
            background: rgba(255, 255, 255, 0.02);
          }
          
          .gitlog-entry:last-child {
            border-bottom: none;
          }
          
          .gitlog-category {
            display: inline-block;
            padding: 0.125rem 0.5rem;
            border-radius: 0.25rem;
            font-size: 0.75rem;
            font-weight: 500;
            border: 1px solid;
            margin-bottom: 0.5rem;
          }
          
          .gitlog-category-new {
            background: rgba(34, 197, 94, 0.1);
            color: #22c55e;
            border-color: rgba(34, 197, 94, 0.2);
          }
          
          .gitlog-category-fixed {
            background: rgba(59, 130, 246, 0.1);
            color: #3b82f6;
            border-color: rgba(59, 130, 246, 0.2);
          }
          
          .gitlog-category-improved {
            background: rgba(245, 158, 11, 0.1);
            color: #f59e0b;
            border-color: rgba(245, 158, 11, 0.2);
          }
          
          .gitlog-category-other {
            background: rgba(255, 255, 255, 0.05);
            color: rgba(255, 255, 255, 0.5);
            border-color: rgba(255, 255, 255, 0.1);
          }
          
          .gitlog-title {
            font-size: 0.875rem;
            font-weight: 500;
            margin-bottom: 0.5rem;
            line-height: 1.4;
          }
          
          .gitlog-date {
            font-size: 0.75rem;
            color: rgba(255, 255, 255, 0.5);
            margin-bottom: 0.5rem;
          }
          
          .gitlog-link {
            display: inline-flex;
            align-items: center;
            gap: 0.25rem;
            font-size: 0.75rem;
            color: ${config.colors.primary || '#ff6b35'};
            text-decoration: none;
          }
          
          .gitlog-link:hover {
            text-decoration: underline;
          }
          
          #gitlog-widget-footer {
            padding: 0.75rem;
            border-top: 1px solid rgba(255, 255, 255, 0.06);
            background: rgba(255, 255, 255, 0.02);
          }
          
          #gitlog-widget-footer a {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.25rem;
            font-size: 0.75rem;
            color: rgba(255, 255, 255, 0.5);
            text-decoration: none;
          }
          
          #gitlog-widget-footer a:hover {
            color: ${config.colors.primary || '#ff6b35'};
          }
          
          #gitlog-powered-by {
            text-align: center;
            margin-top: 0.5rem;
          }
          
          #gitlog-powered-by a {
            font-size: 0.75rem;
            color: rgba(255, 255, 255, 0.5);
            text-decoration: none;
          }
          
          #gitlog-powered-by a:hover {
            color: ${config.colors.primary || '#ff6b35'};
          }
        </style>

        <div id="gitlog-widget-container-2">
          <div id="gitlog-widget-header">
            <div id="gitlog-widget-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${config.colors.primary || '#ff6b35'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
              </svg>
              <span>What's New</span>
              ${entries.length > 0 ? `<span id="gitlog-widget-badge">${entries.length}</span>` : ''}
            </div>
            <svg id="gitlog-widget-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </div>

          <div id="gitlog-widget-content">
            ${entries.length === 0 
              ? '<div style="padding: 1rem; text-align: center; color: rgba(255, 255, 255, 0.5); font-size: 0.875rem;">No recent updates</div>'
              : entries.map(entry => `
                  <a href="${entry.prUrl}" target="_blank" rel="noopener noreferrer" class="gitlog-entry">
                    ${config.options.showCategory ? `
                      <span class="gitlog-category gitlog-category-${entry.category.toLowerCase()}">
                        ${entry.category}
                      </span>
                    ` : ''}
                    <div class="gitlog-title">${entry.aiRewrite || entry.title}</div>
                    ${config.options.showDate ? `
                      <div class="gitlog-date">${new Date(entry.mergedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}</div>
                    ` : ''}
                    <span class="gitlog-link">
                      View details
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                        <polyline points="15 3 21 3 21 9"/>
                        <line x1="10" y1="14" x2="21" y2="3"/>
                      </svg>
                    </span>
                  </a>
                `).join('')
            }
          </div>

          <div id="gitlog-widget-footer">
            <a href="https://gitlog.app/changelog/${config.userId}/${config.repoId}" target="_blank" rel="noopener noreferrer">
              View all updates
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </a>
          </div>
        </div>

        <div id="gitlog-powered-by">
          <a href="https://gitlog.app" target="_blank" rel="noopener noreferrer">
            Powered by GitLog
          </a>
        </div>
      </div>
    `;

    container.innerHTML = widgetHTML;

    // Add click handler for toggle
    const header = document.getElementById('gitlog-widget-header');
    const content = document.getElementById('gitlog-widget-content');
    const chevron = document.getElementById('gitlog-widget-chevron');

    if (header && content && chevron) {
      header.addEventListener('click', () => {
        const isHidden = content.classList.contains('hidden');
        if (isHidden) {
          content.classList.remove('hidden');
          chevron.style.transform = 'rotate(180deg)';
        } else {
          content.classList.add('hidden');
          chevron.style.transform = 'rotate(0deg)';
        }
      });
    }

    // Track impression
    fetch(`${config.apiUrl}/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ widgetId, action: 'impression' }),
    }).catch(() => {});
  }

  // Initialize widget
  initWidget();
})();
