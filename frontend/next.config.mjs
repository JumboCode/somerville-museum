/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        MJ_APIKEY_PUBLIC: process.env.MJ_APIKEY_PUBLIC,
        MJ_APIKEY_PRIVATE: process.env.MJ_APIKEY_PRIVATE,
    },
};

export default nextConfig;

