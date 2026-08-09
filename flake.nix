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

          checks.web-lint = pkgs.buildNpmPackage {
            pname = "web-lint";
            version = "0.0.0";
            src = ./web;
            npmDepsHash = "sha256-NoKHe642rraBXu2G1i1VTSlsAZeGzdBzZ8fBdwkBkVs=";
            npmBuildScript = "lint";
            installPhase = "touch $out";
          };

          treefmt = {
            projectRootFile = "flake.nix";
            programs.nixfmt.enable = true;
          };
        };
    };
}
