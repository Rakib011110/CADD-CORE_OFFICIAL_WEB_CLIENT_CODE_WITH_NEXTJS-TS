import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Enhanced Facebook Pixel Code */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                
                fbq('init', '408403910510266');
                fbq('track', 'PageView');
                
                // Enable Advanced Matching (optional - improves conversion tracking)
                fbq('init', '408403910510266', {
                  em: 'auto', // Email hashing
                  fn: 'auto', // First name hashing  
                  ln: 'auto', // Last name hashing
                  ph: 'auto', // Phone hashing
                  ct: 'auto', // City hashing
                  st: 'auto', // State hashing
                  zp: 'auto'  // Zip code hashing
                });
              `,
            }}
          />
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src="https://www.facebook.com/tr?id=408403910510266&ev=PageView&noscript=1"
            />
          </noscript>

          {/* Optional: Add meta tags for better tracking */}
          <meta property="fb:pixel_id" content="408403910510266" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;