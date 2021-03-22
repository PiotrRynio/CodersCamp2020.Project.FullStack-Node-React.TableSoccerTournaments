import { CommandBus } from '../../../../../src/shared/core/application/command/CommandBus';
import { testDoublesTournamentsModule } from './TestDoublesTournamentsModule';
import { FromListIdGeneratorStub } from '../../../../test-support/shared/core/FromListIdGeneratorStub';
import { MatchWasCalled } from '../../../../../src/modules/doubles-tournament/core/domain/event/MatchWasCalled';
import { StartMatch } from '../../../../../src/modules/match-module/core/application/command/StartMatch';

describe('Starting match', () => {
  it('when match was called, then execute command for starting such match', () => {
    //Given
    const team1Id = 'Team1Id';
    const team2Id = 'Team2Id';
    const tournamentId = 'TournamentId';
    const matchNumber = 1;
    const tableNumber = 1;
    const currentTime = new Date();
    const entityIdGen = FromListIdGeneratorStub([team1Id, team2Id]);
    const commandBus: CommandBus = {
      registerHandler: jest.fn(),
      execute: jest.fn(),
    };

    //When
    const doublesTournament = testDoublesTournamentsModule(currentTime, entityIdGen, commandBus);
    const matchWasCalled = new MatchWasCalled({
      occurredAt: currentTime,
      tournamentId: tournamentId,
      calledMatch: { matchNumber, team1Id, team2Id },
      tableNumber: tableNumber,
    });
    doublesTournament.publishEvent(matchWasCalled);

    //Then
    const startMatch = new StartMatch({
      matchId: 'TournamentId_1',
      firstMatchSideId: team1Id,
      secondMatchSideId: team2Id,
    });
    expect(commandBus.execute).toBeCalledWith(startMatch);
  });
});