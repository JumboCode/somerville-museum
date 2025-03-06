/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

//  export default {
// 	async fetch(request, env) {
// 	  // For example, the request URL my-worker.account.workers.dev/image.png
// 	  const url = new URL(request.url);
// 	  const key = url.pathname.slice(1);
// 	  // Retrieve the key "image.png"
// 	  const object = await env.SOMERVILLE_MUSEUM.get(key);
  
// 	  if (object === null) {
// 		return new Response("Object, Not boobies", { status: 404 });
// 	  }
  
// 	  const headers = new Headers();
// 	  object.writeHttpMetadata(headers);
// 	  headers.set("etag", object.httpEtag);
  
// 	  return new Response(object.body, {
// 		headers,
// 	  });
// 	},
//   };

export default {
    async fetch(request, env) {
        console.log("IN WORKER")
        if (request.method === "GET") {
            // For example, the request URL my-worker.account.workers.dev/image.png
            const url = new URL(request.url);
            const key = url.pathname.slice(1);
            // Retrieve the key "image.png"
            const object = await env.SOMERVILLE_MUSEUM.get(key);
        
            if (object === null) {
                return new Response("Object Not Found", { status: 404 });
            }
        
            const headers = new Headers();
            object.writeHttpMetadata(headers);
            headers.set("etag", object.httpEtag);
        
            return new Response(object.body, {
                headers,
            });
        }

        if (request.method === "PUT") {
            // Check for Authorization header and validate it
            const auth = request.headers.get("Authorization");
            const expectedAuth = `Bearer ${env.AUTH_SECRET}`;
        
            if (!auth || auth !== expectedAuth) {
                return new Response("Unauthorized", { status: 401 });
            }
        
            const url = new URL(request.url);
            const key = url.pathname.slice(1);
            await env.SOMERVILLE_MUSEUM.put(key, request.body);
            return new Response(`Object ${key} uploaded successfully!`);
        }
    
        // You can include any other methods or logic below here...
    },

};