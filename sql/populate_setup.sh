#!/bin/bash

sed -i "s/##INGESTOR-SQL-PASS##/$INGESTOR_SQL_PASS/g;s/##CRISISAPP-SQL-PASS##/$CRISISAPP_SQL_PASS/g" setup.sql
