{ pkgs, ... }:
pkgs.buildNpmPackage {
  pname = "web";
  version = "0.0.0";
  src = ../web;
  npmDepsHash = "sha256-qraM0H5BgFs5CpFCAGtXyGjLvu8H6xIZFNcXRBvc3p4=";
  installPhase = ''
    mkdir -p $out/share/web
    cp -r dist/. $out/share/web
  '';
}
