# Bolajon reyting serveri
FROM node:22-alpine
WORKDIR /app
COPY index.mjs regions.json ./
ENV PORT=8787 DATA_FILE=/data/scores.json
VOLUME /data
EXPOSE 8787
USER node
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1:${PORT}/health || exit 1
CMD ["node", "index.mjs"]
