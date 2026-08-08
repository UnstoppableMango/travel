build:
	nix build .#

build-web:
	nix build .#web

update:
	nix flake update

check lint:
	nix flake check

format fmt:
	nix fmt

dev-web:
	cd web && npm run dev
