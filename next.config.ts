import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      /* Editorial moved under FOUND HER. Product URLs are unchanged. */
      { source: "/women", destination: "/found-her", permanent: true },
      { source: "/journal", destination: "/found-her", permanent: true },
      /* Previous journal slugs, mapped to the pieces that replaced them. */
      {
        source: "/journal/the-moment-before",
        destination: "/found-her/the-ten-minutes-before",
        permanent: true,
      },
      { source: "/journal/quiet-wins", destination: "/found-her/nobody-clapped", permanent: true },
      {
        source: "/journal/notes-between-women",
        destination: "/found-her/what-she-said-once",
        permanent: true,
      },
      { source: "/journal/:slug", destination: "/found-her", permanent: true },
      { source: "/prelaunch", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
