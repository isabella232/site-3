import * as React from 'react';
import { Progress } from 'semantic-ui-react';
import zxcvbn from 'zxcvbn';

const PASSWORD_STRENGTH_LABELS: { [ score: number ]: string } = {
  0: 'Too guessable!',
  1: 'Very guessable',
  2: 'Somewhat guessable',
  3: 'Somewhat safe',
  4: 'Very safe!',
};

export default function PasswordStrengthMeter({ password }: { password: string }) {
  const passwordStrength = zxcvbn(password);

  return (
    <Progress
      value={passwordStrength.score}
      total={4}
      success={passwordStrength.score >= 4}
      warning={passwordStrength.score === 3}
      error={passwordStrength.score < 2 && password.length > 0}>
      {
        password.length === 0 ?
          'Password strength' :
          PASSWORD_STRENGTH_LABELS[ passwordStrength.score ]
      }
    </Progress>
  );
}