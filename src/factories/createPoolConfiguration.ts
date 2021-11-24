/* eslint-disable id-match */

import type {
  PoolConfig,
} from 'pg';
import {
  Logger as log,
} from '../Logger';
import type {
  ClientConfigurationType,
} from '../types';
import {
  parseDsn,
} from '../utilities';

export const createPoolConfiguration = (dsn: string, clientConfiguration: ClientConfigurationType): PoolConfig => {
  const connectionOptions = parseDsn(dsn);

  const poolConfiguration: PoolConfig = {
    application_name: connectionOptions.applicationName,
    database: connectionOptions.databaseName,
    host: connectionOptions.host,
    password: connectionOptions.password,
    port: connectionOptions.port,
    ssl: false,
    user: connectionOptions.username,
  };

  if (connectionOptions.sslMode === 'disable') {
    poolConfiguration.ssl = false;
  } else if (connectionOptions.sslMode === 'require') {
    if (clientConfiguration.ssl) {
      poolConfiguration.ssl = {
        ...clientConfiguration.ssl,
        rejectUnauthorized: true,
      };
    } else {
      poolConfiguration.ssl = true;
    }
  } else if (connectionOptions.sslMode === 'no-verify') {
    if (clientConfiguration.ssl) {
      poolConfiguration.ssl = {
        ...clientConfiguration.ssl,
        rejectUnauthorized: false,
      };
    } else {
      poolConfiguration.ssl = {
        rejectUnauthorized: false,
      };
    }
  }

  if (clientConfiguration.connectionTimeout !== 'DISABLE_TIMEOUT') {
    if (clientConfiguration.connectionTimeout === 0) {
      log.warn('connectionTimeout=0 sets timeout to 0 milliseconds; use connectionTimeout=DISABLE_TIMEOUT to disable timeout');

      poolConfiguration.connectionTimeoutMillis = 1;
    } else {
      poolConfiguration.connectionTimeoutMillis = clientConfiguration.connectionTimeout;
    }
  }

  if (clientConfiguration.statementTimeout !== 'DISABLE_TIMEOUT') {
    if (clientConfiguration.statementTimeout === 0) {
      log.warn('statementTimeout=0 sets timeout to 0 milliseconds; use statementTimeout=DISABLE_TIMEOUT to disable timeout');

      poolConfiguration.statement_timeout = 1;
    } else {
      poolConfiguration.statement_timeout = clientConfiguration.statementTimeout;
    }
  }

  if (clientConfiguration.idleInTransactionSessionTimeout !== 'DISABLE_TIMEOUT') {
    if (clientConfiguration.idleInTransactionSessionTimeout === 0) {
      log.warn('idleInTransactionSessionTimeout=0 sets timeout to 0 milliseconds; use idleInTransactionSessionTimeout=DISABLE_TIMEOUT to disable timeout');

      poolConfiguration.idle_in_transaction_session_timeout = 1;
    } else {
      poolConfiguration.idle_in_transaction_session_timeout = clientConfiguration.idleInTransactionSessionTimeout;
    }
  }

  if (clientConfiguration.maximumPoolSize) {
    poolConfiguration.max = clientConfiguration.maximumPoolSize;
  }

  return poolConfiguration;
};
