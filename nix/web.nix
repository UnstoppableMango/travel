{ buildNpmPackage }:
buildNpmPackage {
  pname = "web";
  version = "0.0.0";
  src = ../web;
  npmDepsHash = "sha256-3xL1/AXK1pLszPm2fIcn+HMaCAA+P0+Y4/5nx1h23Jw=";
  installPhase = ''
    mkdir -p $out/share/web
    cp -r dist/. $out/share/web
  '';
}
