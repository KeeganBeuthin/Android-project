module.exports = {
  reactStrictMode: true,
  async rewrites(){
    console.log('rewrites in use')
    return[{
      source: "/api/:path*",
      destination:'/api/:path*',
    },
  ];
  },
  transpilePackages: ['@ionic/react', '@ionic/core', '@stencil/core', 'ionicons'],
}
