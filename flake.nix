{
  description = "game-of-life nix env";

  inputs = {
    flake-utils= {
      url = "github:numtide/flake-utils";
    };
  };
  outputs = {
    self,
    nixpkgs,
    flake-utils,
    ...
  }@inputs:
    flake-utils.lib.eachDefaultSystem (
      system: let
        pkgs = import nixpkgs {inherit system;};
        nodePkgs = with pkgs.nodePackages; [
          eslint
          prettier
          stylelint
          typescript
          typescript-language-server
          vscode-langservers-extracted
          yaml-language-server
          yarn
        ];
      in
        {
          devShells.default = pkgs.mkShell rec {
            nativeBuildInputs = (with pkgs; [
              pkg-config
            ]);
            
            buildInputs = with pkgs; [
              nodejs_22
            ];
          
            packages = with pkgs; [
              jq
              marksman
            ] ++ nodePkgs;

            libInputs = buildInputs ++ nativeBuildInputs;
            libraryPkgs = pkgs.lib.makeLibraryPath libInputs;

            # shellHook = ''
            #   export LD_LIBRARY_PATH="${libraryPkgs}:$LD_LIBRARY_PATH"
            # '';
            LD_LIBRARY_PATH = libraryPkgs;
          };
        }
    );
}
