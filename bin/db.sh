#!/bin/sh
mongorestore --collection question --db fetest ../db-backup/question.bson
mongorestore --collection test --db fetest ../db-backup/test.bson
