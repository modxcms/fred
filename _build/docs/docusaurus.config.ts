import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Fred',
  tagline: 'Friendly Editor',
  favicon: 'https://modx.com/favicon.svg',
  future: {
    v4: true,
  },

  url: 'https://modxcms.github.io',
  baseUrl: '/fred/',
  organizationName: 'modxcms',
  projectName: 'fred',

  onBrokenLinks: 'throw',

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'throw',
      onBrokenMarkdownImages: 'throw'
    }
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

   headTags: [
    {
      tagName: 'meta',
      attributes: {
        name: 'algolia-site-verification',
        content: '2841EAF47DF53C20',
      },
    },
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          path: '../../docs',
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/modxcms/fred/tree/main/_build/docs/',
        },
        blog: false,
        pages: false,
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Fred',
      logo: {
        alt: 'Fred',
        src: 'https://modx.com/assets/themes/manana/images/logo-icon.svg',
      },
      items: [
        {
          href: 'https://github.com/modxcms/fred',
          label: 'GitHub',
          position: 'right',
        },
        {
          href: 'https://modx.com/get-help/',
          label: 'Get Help',
          position: 'right',
        },
      ],
    },
    footer: {
      links: [
        {
          label: 'X',
          href: 'https://x.com/modx',
        },
        {
          label: 'YouTube',
          href: 'https://www.youtube.com/modx',
        },
        {
          label: "Blog",
          href: "https://modx.com/blog/"
        },
        {
          label: "Support",
          href:"mailto:help@modx.com"
        }
      ],
      copyright: `Copyright © ${new Date().getFullYear()} MODX, LLC.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.palenight,
    },
    algolia: {
      appId: 'DFEXG1UAYP',
      apiKey: '014a10a343530b38df78bca3a1376c3c',
      indexName: 'fred',
      contextualSearch: true,
      searchParameters: {},
      searchPagePath: 'search',
      insights: false,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
