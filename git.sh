#!/bin/bash
main_branch="main"
#_____________________________________________________________________________________
#                                                                    Check Credentials
Cred_Check() {
    if ! git config --get user.name || ! git config --get user.email
    then
        git config user.name 'jefaye'
        git config user.email 'clement.jean.l.faye@gmail.com'
    fi
}
#________________________________________________________________________
#                                                            Check Branch
Branch_Check() {
    if [ "$(git rev-parse --abbrev-ref HEAD)" != "$main_branch" ]
    then
        echo -e "[WARNING] Not on branch $main_branch..."
        git branch -a
        exit 1
    fi
}
#____________________________________________________________________________
#                                                                   Add Files
File_Add() {
 if [ $# -eq 0 ]
    then
        echo -e "\nNo Files specified..."
        echo -e "Adding all changes...\n"
        git add .
    else
        echo -e "\nAdding Specified files...\n"
        for file in "$@"
        do
            git add "$file"
            echo -e "Added: $file\n"
        done
    fi
}
#______________________________________________________________
#                                           Syncing with GitHub
Cred_Check
Banch_Check
File_Add "$@"
git status
echo -e "\n"
read -r -p "Enter Commit Message: " message
git commit -a -m "$message"
git push origin "$main_branch"