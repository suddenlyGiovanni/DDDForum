{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";
  };
  outputs =
    { nixpkgs, ... }:
    let
      forAllSystems =
        function:
        nixpkgs.lib.genAttrs nixpkgs.lib.systems.flakeExposed (
          system: function nixpkgs.legacyPackages.${system}
        );
    in
    {
      formatter = forAllSystems (pkgs: pkgs.alejandra);
      devShells = forAllSystems (pkgs: {
        default = pkgs.mkShell {
          packages = with pkgs; [
            corepack_24
            nodejs-slim_24
            biome
          ];
          env = { };
          shellHook = ''
            echo "Nix dev env!"
            echo "Node version: $(node --version)"
            echo "Biome version: $(biome --version)"
            echo "Corepack version: $(corepack --version)"
            echo "pnpm version: $(pnpm -v)"
          '';
         };
      });
    };
}
