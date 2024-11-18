{
  description = "lotro nix env";

  inputs = {
    flake-utils= {
      url = "github:numtide/flake-utils";
      inputs.nixpkgs.follows = "nixpkgs";
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
        rustPkgs = with pkgs; [
          emacs-lsp-booster
        ];
        nodePkgs = with pkgs.nodePackages; [
          eslint
          pnpm
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
          
            packages = with pkgs; [
              marksman
              nodejs_22
            ] ++ nodePkgs ++ rustPkgs;

            # NIX_LD_LIBRARY_PATH = pkgs.lib.makeLibraryPath buildInputs;
            # shellHook = ''
            #   echo "<nix development shell>"
            # '';
          };
        }
    );
}
