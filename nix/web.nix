{ buildNpmPackage }:
buildNpmPackage {
  pname = "web";
  version = "0.0.0";
  src = ../web;
  npmDepsHash = "sha256-NoKHe642rraBXu2G1i1VTSlsAZeGzdBzZ8fBdwkBkVs=";
  installPhase = ''
    mkdir -p $out/share/web
    cp -r dist/. $out/share/web
  '';
}
