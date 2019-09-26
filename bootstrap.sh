#!/usr/bin/env bash

main() {
    # First things first, asking for sudo credentials
    ask_for_sudo
    # Installing Homebrew, the basis of anything and everything
    install_homebrew
    # Cloning loglady repository for install_homebrew_formulae to have access to Brewfile
    clone_loglady_repo
    # Installing all packages in Brewfile
    install_homebrew_formulae
    # Installing all packages in npm
    install_npm_packages
    # Check npm tests
    npm_test
    # Run loglady
    npm_run
}

LOGLADY_LOCAL_REPO=$PWD/kits-ab/loglady

function ask_for_sudo() {
    info "Prompting for sudo password"
    if sudo --validate; then
        # Keep-alive
        while true; do sudo --non-interactive true; \
            sleep 10; kill -0 "$$" || exit; done 2>/dev/null &
        success "Sudo password updated"
    else
        error "Sudo password update failed"
        exit 1
    fi
}

function install_homebrew() {
    info "Installing Homebrew"
    if hash brew 2>/dev/null; then
        success "Homebrew already exists"
    else
        url=https://raw.githubusercontent.com/Homebrew/install/master/install
        if /usr/bin/ruby -e "$(curl -fsSL ${url})"; then
            success "Homebrew installation succeeded"
        else
            error "Homebrew installation failed"
            exit 1
        fi
    fi
}

function clone_loglady_repo() {
    info "Cloning repository into ${LOGLADY_LOCAL_REPO}"
    if test -e "$LOGLADY_LOCAL_REPO"; then
        substep "${LOGLADY_LOCAL_REPO} already exists"
        pull_latest "$LOGLADY_LOCAL_REPO"
        success "Pull successful in ${LOGLADY_LOCAL_REPO} repository"
    else
        url=https://github.com/kits-ab/loglady.git
        if git clone "$url" "$LOGLADY_LOCAL_REPO" && \
           cd "$LOGLADY_LOCAL_REPO" && git checkout feature/automate-dev-env#314 && \
           git -C "$LOGLADY_LOCAL_REPO" remote set-url origin git@github.com:kits-ab/loglady.git; then
            success "Loglady Repository cloned into ${LOGLADY_LOCAL_REPO}"
        else
            error "Loglady Repository cloning failed"
            exit 1
        fi
    fi
}

function install_homebrew_formulae() {
    BREW_FILE_PATH="${LOGLADY_LOCAL_REPO}/macOS.Brewfile"
    info "Installing packages within ${BREW_FILE_PATH}"
    if brew bundle check --file="$BREW_FILE_PATH" &> /dev/null; then
        success "Brewfile's dependencies are already satisfied."
    else
        if brew bundle --file="$BREW_FILE_PATH"; then
            success "Brewfile installation succeeded"
        else
            error "Brewfile installation failed"
            exit 1
        fi
    fi
}

function install_npm_packages() {
    info "Installing all npm packages in ${LOGLADY_LOCAL_REPO}"
    if cd ${LOGLADY_LOCAL_REPO} && npm install &> /dev/null; then
        success "Npm installation succeeded"
    else
        error "Npm installation failed"
        exit 1
    fi
}

function npm_test() {
    info "Checkes everything works in the project"
    if CI=true npm test; then
        success "Npm tests succeeded"
    else
        error "Npm tests failed"
        exit 1
    fi
}

function npm_run() {
    info "Run Loglady project"
    if npm run dev; then
        success "Npm run succeeded"
    else
        error "Npm run failed"
        exit 1
    fi
}

################################
# Help functions
################################

function pull_latest() {
    substep "Pulling latest changes in ${1} repository"
    if git -C $1 pull origin master &> /dev/null; then
        return
    else
        error "Please pull latest changes in ${1} repository manually"
    fi
}

function coloredEcho() {
    local exp="$1";
    local color="$2";
    local arrow="$3";
    if ! [[ $color =~ '^[0-9]$' ]] ; then
       case $(echo $color | tr '[:upper:]' '[:lower:]') in
        black) color=0 ;;
        red) color=1 ;;
        green) color=2 ;;
        yellow) color=3 ;;
        blue) color=4 ;;
        magenta) color=5 ;;
        cyan) color=6 ;;
        white|*) color=7 ;; # white or invalid color
       esac
    fi
    tput bold;
    tput setaf "$color";
    echo "$arrow $exp";
    tput sgr0;
}

function info() {
    coloredEcho "$1" blue "========>"
}

function substep() {
    coloredEcho "$1" magenta "===="
}

function success() {
    coloredEcho "$1" green "========>"
}

function error() {
    coloredEcho "$1" red "========>"
}

main "$@"
