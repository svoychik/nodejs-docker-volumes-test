docker run -d --env PORT=5000 -p 3000:5000 --name node-app \
    -v feedback:/app/feedback \
    -v "/Users/svoychik/Documents/Projects/util-node:/app:ro" \
    -v /app/node_modules \
    -v /app/temp \
    nodeapp