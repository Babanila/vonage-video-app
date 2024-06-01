import type { ComponentType, FC } from 'react';
import type { RouteProps } from 'react-router-dom';
import { Route, Redirect } from 'react-router-dom';
import { useUserContext } from '../context/userContext';

interface UserNameRouteProps extends RouteProps {
  component: ComponentType<any>;
}

export const UserNameRoute: FC<UserNameRouteProps> = ({
  component: Component,
  ...rest
}) => {
  const roomName = (rest as any)?.computedMatch?.params?.roomName;
  const { user } = useUserContext();

  return (
    <Route
      {...rest}
      render={(props: any) =>
        !user?.userName ? (
          <Redirect
            to={{
              pathname: '/',
              state: { room: roomName },
            }}
          />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};
