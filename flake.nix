{
  description = "lotro nix env";

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
              corepack_22
              marksman
            ];

            LD_LIBRARY_PATH = pkgs.lib.makeLibraryPath buildInputs;
            # shellHook = ''
            #   echo "<nix development shell>"
            # '';
          };
        }
    );
}
