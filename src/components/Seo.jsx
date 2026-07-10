// src/components/Seo.jsx
import { Helmet } from "react-helmet-async";

const SITE_NAME = "Sukran Garments";
const DEFAULT_DESCRIPTION =
  "Sukran Garments থেকে কিনুন সেরা মানের শাড়ি, থ্রি-পিস ও সালোয়ার কামিজ, সারাদেশে হোম ডেলিভারি।";
const DEFAULT_IMAGE = "https://sukran-garments.vercel.app/sukran_garments_logo_with_name.png";
const SITE_URL = "https://sukran-garments.vercel";

  <meta
    property="og:image"
    content="https://sukran-garments.vercel.app\sukran_garments_logo_with_name.png"
  />;

const Seo = ({ title, description, image, url, type = "website" }) => {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description || DEFAULT_DESCRIPTION} />

      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta
        property="og:description"
        content={description || DEFAULT_DESCRIPTION}
      />
      <meta property="og:image" content={image || DEFAULT_IMAGE} />
      <meta property="og:url" content={url ? `${SITE_URL}${url}` : SITE_URL} />
      <meta property="og:locale" content="bn_BD" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta
        name="twitter:description"
        content={description || DEFAULT_DESCRIPTION}
      />
      <meta name="twitter:image" content={image || DEFAULT_IMAGE} />

      <link rel="canonical" href={url ? `${SITE_URL}${url}` : SITE_URL} />
    </Helmet>
  );
};

export default Seo;
