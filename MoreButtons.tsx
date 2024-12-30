import React from 'react';
import { Button } from '@/components/elements/button/index';
import { ServerContext } from '@/state/server';
import isEqual from 'react-fast-compare';
import { useStoreState } from 'easy-peasy';
import Can from '@/components/elements/Can';

interface MoreButtonsProp {
    className?: string;
}

export default ({ className }: MoreButtonsProp) => {
    const status = ServerContext.useStoreState((state) => state.status.value);
    const variables = ServerContext.useStoreState((state) => state.server.data!.variables);
    const txAdminOn = variables.find((x) => x.envVariable === 'TXADMIN_ENABLE');
    const txAdminPort = variables.find((x) => x.envVariable === 'TXADMIN_PORT')?.serverValue;
    const txAdminIp = ServerContext.useStoreState((state) =>
        state.server
            .data!.allocations.filter((alloc) => alloc.port === Number(txAdminPort))
            .map((allocation) => (allocation.alias || allocation.ip) + ':' + allocation.port)
    ).toString();
    const username = useStoreState((state) => state.user.data!.username);
    const id = ServerContext.useStoreState((state) => state.server.data!.id);
    const sftp = ServerContext.useStoreState((state) => state.server.data!.sftpDetails, isEqual);

    return (
        <div className={className}>
            {Number(txAdminOn?.serverValue) === 1 && txAdminIp ? (
                <Button.Text
                    className={'flex-1'}
                    disabled={!status || status === 'offline' || status === 'stopping'}
                    onClick={() => {
                        window.open(`http://${txAdminIp}`);
                    }}
                >
                    TxAdmin
                </Button.Text>
            ) : null}
            <Can action={'database.*'}>
                <Button.Text
                    className={'flex-1'}
                    onClick={() => {
                        window.open('https://jirryl.my.id/pma');
                    }}
                >
                    phpMyAdmin
                </Button.Text>
            </Can>
            <Can action={'file.sftp'}>
                <Button.Text
                    className={'flex-1'}
                    onClick={() => {
                        window.open(`sftp://${username}.${id}@${sftp.ip}:${sftp.port}`);
                    }}
                >
                    SFTP
                </Button.Text>
            </Can>
        </div>
    );
};
