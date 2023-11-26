FROM rust:latest
WORKDIR /app
COPY . .
RUN cargo build # TODO: change this to release
CMD ["./target/debug/nuitdelinfo"] # TODO: change this to release
