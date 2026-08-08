{
  description = "UnstoppableMango's travel repository";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    systems.url = "github:nix-systems/triplet";
    flake-parts = {
      url = "github:hercules-ci/flake-parts";
      inputs.nixpkgs-lib.follows = "nixpkgs";
    };

    treefmt-nix = {
      url = "github:numtide/treefmt-nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs =
    inputs@{ flake-parts, ... }:
    flake-parts.lib.mkFlake { inherit inputs; } {
      systems = import inputs.systems;
      imports = [ inputs.treefmt-nix.flakeModule ];

      perSystem =
        {
          config,
          pkgs,
          ...
        }:
        {
          devShells.default = pkgs.mkShellNoCC {
            packages = with pkgs; [
              gnumake
              nixfmt
              nodejs
            ];
          };

          packages = {
            default = config.formatter;
            web = pkgs.callPackage ./nix/web.nix { };
          };

          checks.web-lint = pkgs.stdenvNoCC.mkDerivation {
            name = "web-lint";
            src = ./web;
            nativeBuildInputs = [ pkgs.nodejs ];
            buildPhase = ''
              export HOME=$(mktemp -d)
              npm ci --ignore-scripts
              npm run lint
            '';
            installPhase = "touch $out";
          };

          treefmt = {
            projectRootFile = "flake.nix";
            programs.nixfmt.enable = true;
          };
        };
    };
}
