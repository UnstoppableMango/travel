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
            web = pkgs.buildNpmPackage {
              pname = "web";
              version = "0.0.0";
              src = ./web;
              npmDepsHash = "sha256-qraM0H5BgFs5CpFCAGtXyGjLvu8H6xIZFNcXRBvc3p4=";
              installPhase = ''
                mkdir -p $out/share/web
                cp -r dist/. $out/share/web
              '';
            };
          };

          treefmt = {
            projectRootFile = "flake.nix";
            programs.nixfmt.enable = true;
          };
        };
    };
}
