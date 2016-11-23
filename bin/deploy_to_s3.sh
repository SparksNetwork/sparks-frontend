#!/usr/bin/env bash

aws s3 cp dist/ s3://access.sparks.network/ --recursive
