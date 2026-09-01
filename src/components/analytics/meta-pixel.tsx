/**
 * Server component: the script tag must be part of the HTML the server
 * sends, not injected via useEffect, or Meta's domain verification / event
 * priority (Aggregated Event Measurement) breaks for iOS users.
 */
export function MetaPixel() {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

  if (!pixelId) {
    return null;
  }

  const snippet = `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${pixelId}');
fbq('track', 'PageView');
`;

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: snippet }} />
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
