This is a real-time simple invenroy management system that allow organization without logistical support in order to maintain everything that comes in and out.

Technologies : Next.js (Typescript) , tailwindcss and shadcn/ui , socket.io, Redis
My redis db stored here : https://upstash.com/
but feel free to use any service you like

running socket io server is required. here's one:
https://github.com/nevgauker/simple_socket_server

There are 3 typess of evens : object creation, object update and object delete

Required environment variables :

NEXT_PUBLIC_REDIS_URL - redis url
NEXT_PUBLIC_REDIS_TOKEN redis token
NEXT_PUBLIC_ADMIN - admin email
NEXT_PUBLIC_ADMIN_PASS - admi password

optional ones for future usage:

NEXT_PUBLIC_PLACE_NAME
NEXT_PUBLIC_PLACE_FLOORS
