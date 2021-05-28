# Advanced Analytics for IU’s Addictions Grand Challenge (A2AGC)

Scripts for compiling, validating, and documenting the [A2AGC](https://node.cns.iu.edu/client/a2agc/) Data and Website.

## Change Log

See [CHANGELOG](CHANGELOG.md)

## Updating Content

To update the content for individual visualizations, see the [website/src/assets/pages/](website/src/assets/pages/) folder. Each visualization is appropriately named. Inside each visualization page is a `README.md` that has the main content that can be edited. You can also edit the `vis.vl.json` and `data.sql` files. The `README.md` and `vis.vl.json`, once edited in the `main` or `develop` branch, will appear in the [production](https://node.cns.iu.edu/client/a2agc/) or [staging](https://node.cns.iu.edu/client/a2agc/staging/) sites respectively after about 10 minutes. If you don't have write access to this repository, you can make a Pull Request and a developer will review the changes before merging the changes in.

## Software Development

### Base Requirements

* bash
* Python 3+
* Java 1.8+
* Node JS 10+
* sqlite3
* sqlcipher
* GraphViz (dot)

### Singularity

A Docker container is provided that installs all the dependencies needed for building the A2AGC dataset. You can install the container using this command: `singularity build container.sif docker://cnsiu/a2agc-dataset`. This will create a `container.sif` file that can be invoked on command line: `$ ./container.sif` which will bring you into the container with all dependencies installed and at a shell prompt.

## Credits

Developed as a collaboration between the [Cyberinfrastructure for Network Science Center at Indiana University](http://cns.iu.edu/) and the [Regenstrief Institute](https://www.regenstrief.org/) as part of Indiana University's [Addictions Grand Challenge](https://addictions.iu.edu/responding-to-crisis/grand-challenge.html).

