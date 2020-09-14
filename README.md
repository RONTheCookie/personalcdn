# personalcdn
Just another ~~CDN~~ file uploader.

# Docker
~~Docker Compose Example:~~ **This is outdated**
```yaml
version: 3
services:
    personalcdn:
        ports:
            - '80:8080'
        environment:
            - CDN_SECRET=YourSecretHere
        volumes:
            - '/path/to/data/directory:/usr/src/app/data'
        image: ronthecookie/personalcdn
```
