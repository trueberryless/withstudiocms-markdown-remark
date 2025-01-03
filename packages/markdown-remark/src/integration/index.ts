import type { AstroIntegration } from 'astro';
import { addVirtualImports, createResolver } from 'astro-integration-kit';
import { shared } from './shared.js';

export function markdownRemark(): AstroIntegration {
	const { resolve } = createResolver(import.meta.url);
	return {
		name: '@studiocms/markdown-remark',
		hooks: {
			'astro:config:setup'(params) {
				addVirtualImports(params, {
					name: '@studiocms/markdown-remark',
					imports: {
						'studiocms:markdown-remark': `export * from '${resolve('./markdown.js')}';`,
					},
				});
			},
			'astro:config:done'({ injectTypes, config }) {
				shared.markdownConfig = config.markdown;
				injectTypes({
					filename: 'render.d.ts',
					content: `// This file is generated by @studiocms/markdown-remark
					
					declare module 'studiocms:markdown-remark' {
						export const render: typeof import('${resolve('./markdown.js')}').render;
						export const Markdown: typeof import('${resolve('./markdown.js')}').Markdown;
						export type Props = import('${resolve('./markdown.js')}').Props;
						export type RenderResponse = import('${resolve('./markdown.js')}').RenderResponse;
					}
                    `,
				});
			},
		},
	};
}
