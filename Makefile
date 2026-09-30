build:
	nix build .# .#web

update:
	nix flake update

check lint:
	nix flake check

# Refresh every npmDepsHash after a package-lock.json change.
SYSTEM = $(shell nix eval --impure --raw --expr builtins.currentSystem)
hashes:
	nix-update --flake --version=skip web
	nix-update --flake --version=skip checks.$(SYSTEM).infra-typecheck

format fmt:
	nix fmt

dev-web:
	cd web && npm run dev
