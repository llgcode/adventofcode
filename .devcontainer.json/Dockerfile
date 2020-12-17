FROM mcr.microsoft.com/vscode/devcontainers/base:ubuntu

ENV DENO_INSTALL=/usr/lib/deno
RUN curl -fsSL https://deno.land/x/install/install.sh | sh
RUN ln -s "${DENO_INSTALL}/bin/deno" /usr/bin/deno

RUN apt-get update
RUN DEBIAN_FRONTEND=noninteractive apt-get -y install make gcc clang