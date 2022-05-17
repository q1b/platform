const path = require('path');

module.exports = {
    stories: ['../src/stories/**/*.stories.tsx'],
    logLevel: 'debug',
    addons: [
        '@storybook/addon-storysource',
        '@storybook/addon-actions',
        '@storybook/addon-links',
        '@storybook/addon-knobs',
        '@storybook/addon-viewport',
        '@storybook/addon-backgrounds',
        '@storybook/addon-a11y',
        // '@storybook/addon-postcss',
        {
            name: '@storybook/addon-postcss',
            options: {
                postcssLoaderOptions: {
                    implementation: require('postcss'),
                }
            }
        }
        // {
        //     name: '@storybook/addon-postcss',
        //     options: {
        //       cssLoaderOptions: {
        //         // When you have splitted your css over multiple files
        //         // and use @import('./other-styles.css')
        //         importLoaders: 1,
        //       },
        //       postcssLoaderOptions: {
        //         // When using postCSS 8
        //         implementation: require('postcss'),
        //       },
        //     },
        //   }
    ],
    webpackFinal: (config) => {
        // config.resolve.alias['@'] = [path.resolve(__dirname, '../src/'), path.resolve(__dirname, '../')];
        // config.resolve.alias = {
        //     ...config.resolve?.alias,
        //     // x: [path.resolve(__dirname, '../src/'), path.resolve(__dirname, '../')],
        //     '@': path.resolve(__dirname, '../src/') + path.resolve(__dirname, '../')
        //   };
        config.module.rules.push({
            test: /\.s?css$/,
            use: [
                'style-loader',
                {
                    loader: 'css-loader',
                    options: {
                        modules: {
                            localIdentName: '[local]',
                        },
                    },
                },
                {
                    loader: 'postcss-loader',
                    options: {
                        implementation: require('postcss')
                    }
                },
            ],
        });
        // config.module.rules.push(  {
        //     test: /\.(css|postcss)$/,
        //     use: [
        //       'style-loader',
        //       { loader: 'css-loader', options: { importLoaders: 1 } },
        //       {
        //         loader: 'postcss-loader',
        //         options: {
        //           implementation: require('postcss')
        //         }
        //       }
        //     ]
        //   })
        config.module.rules.push({
            test: [/\.stories\.js$/],
            use: [require.resolve('@storybook/source-loader')],
            include: [path.resolve(__dirname, '../src')],
            enforce: 'pre',
        });
        return {
            ...config,
            resolve: {
                ...config.resolve,
                alias: {
                    ...config.resolve.alias,
                },
            },
        };
    },
    core: {
        builder: 'webpack5',
    },
};