""" - = EOF (End Of Frame not End Of File)
    xx = double strike on bonus frame
    x = strike
    8/ = Spare with 8 on the first roll and 2 on the second
    81 = Open frame with 8 on roll 1 and 1 on roll 2
    80 = Open frame with 8 on roll 1 and 0 on roll 2 (- for open frame is invalid)
    thanks to linuxtopia for ideas
    https://www.linuxtopia.org/online_books/programming_books/python_programming/python_ch40.html"""
num_players = None
strike = "x"
spare = "/"
frame = 1


class BowlingGame:
    games = 0

    def __init__(self, init: str = ""):
        BowlingGame.games += 1

        self.player_num = BowlingGame.games
        self.game_str = init
        self.current_frame = ""
        self.frame_active = True
        self.bonus_throws = 0
        self.bonus_given = False
        self.total = 0

    @property
    def throws_this_frame(self):
        return len(self.current_frame)

    @staticmethod
    def score_frame_str(frame_str: str) -> list[int]:
        frame = []
        if frame_str.startswith(strike):
            frame.append(10)
            if len(frame_str) >= 2:
                if frame_str[1] == strike:
                    frame.append(10)
                else:
                    frame.append(int(frame_str[1]))
            # frame was a spare
        elif frame_str.endswith(spare) and len(frame_str) == 2:
            frame.append(int(frame_str[0]))
            frame.append(10 - int(frame_str[0]))
        else:
            # open frame usually
            for c in frame_str:
                # XXX unoptimal
                try:
                    frame.append(int(c))
                except ValueError:
                    # char could not be converted to int, just ignore it and move on.
                    pass
        return frame

    def __gen(self) -> list[int]:
        """Validates a 21-character string as describing a legal game.
        returns a list that describes the game

        Valid games:
        x-x-x-x-x-x-x-x-x-x-xx (Score 300) returns [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10]
        25-71-53-52-81-24-90-04-3/-9/-0 (Score 77) returns [2, 5, 7, 1, 5, 3, 5, 2, 8, 1, ...]"""
        frames = []
        for frame in self.game_str.lower().split("-"):
            # frame = "xx" | "3/" | "12" | "00" | "x" | etc.
            frames.extend(self.score_frame_str(frame))
        return frames

    def add_score(self, score: str):
        end_of_frame = False
        self.game_str += score
        self.current_frame += score
        if len(self.current_frame) == 2 or score == strike:
            if self.bonus_throws == 0:
                self.current_frame = ""
                self.game_str += "-"
            end_of_frame = True
        return end_of_frame

    def score_game(self) -> int:
        game: list[int] = self.__gen()
        total = 0
        while game:
            # print(total, game)
            v = game.pop(0)
            bonus = 0
            if not game:  # Last value is just added to total.
                total += v
                break
            if v == 10:  # strike
                if len(game) >= 3:
                    # strike bonus is the sum of next two throws
                    bonus += sum(game[0:2])
                # elif len(game) > 1:
                #     bonus += game[0]
                total += 10 + bonus
            elif v + game[0] == 10:  # spare
                if len(game) >= 3:
                    bonus = game[1]
                total += 10 + bonus
                game.pop(0)
            else:  # Open frame
                total += v + game.pop(0)
        return total

    def get_valid_throw(self) -> str:
        is_valid = False
        score = None
        # So player doesn't try to spare on the first throw.
        can_spare = len(self.current_frame) > 0
        while not is_valid:
            score = input(
                f"P{self.player_num}: What did you bowl?: ")
            if score == spare and not can_spare:
                print("Cannot spare on the first throw.")
                continue
            elif score == strike and can_spare and not frame == 10:
                print("Can't strike on the second throw.")
                continue

            is_valid = len(score) == 1 and ((score.isnumeric() and int(score) >= 0 and int(
                score) < 10) or score == strike or score == spare)
            if not is_valid:
                print(
                    "Input provided was invalid. Valid options are 0-9, x, or / on second throw.")
        return score  # type: ignore


while not isinstance(num_players, int):
    try:
        num_players = int(input("How many players: "))
    except ValueError:
        print("Please give a number.")

print(f"- = EOF (End Of Frame not End Of File)\n"
      f"xx = double strike on bonus frame\n"
      f"x = strike\n"
      f"8/ = Spare with 8 on the first roll and 2 on the second\n"
      f"81 = Open frame with 8 on roll 1 and 1 on roll 2\n"
      f"80 = Open frame with 8 on roll 1 and 0 on roll 2 (- for open frame is invalid)\n\n"
      f"Valid games:\n"
      f"\tx-x-x-x-x-x-x-x-x-x-xx (Score 300)\n"
      f"\t25-71-53-52-81-24-90-04-3/-9/-0 (Score 77)\n"
      f"\t00-00-00-00-00-00-00-00-00-00-0 (Score 0)\n"
      f"\t1/-2/-3/-4/-5/-6/-7/-8/-9/-x (Score 129)\n"
      f"\t36-45-27-18-81-36-45-36-54-72 (Score 97)\n\n")


players: list[BowlingGame] = []

for i in range(num_players):
    players.append(BowlingGame())

while True:
    print(f"\tFrame {frame}")
    completed_bowlers = []
    while len(completed_bowlers) != len(players):
        # Ensure that all players have finished this frame before moving on
        # to the next frame.
        for game in players:
            if not game.frame_active:
                continue  # skip if bowler has finished their frame already.
            throw = game.get_valid_throw()
            end_frame = game.add_score(throw)
            frame_score = sum(game.score_frame_str(game.current_frame))
            if end_frame:
                print(f"P{game.player_num}'s current score: {game.score_game()}")
                if frame == 10 and game.bonus_throws == 0 and not game.bonus_given:
                    if throw == strike:
                        game.bonus_throws = 2
                    elif throw == spare:
                        game.bonus_throws = 1
                    print(
                        f"P{game.player_num} given {game.bonus_throws} bonus throws.")
                    game.bonus_given = True
                if game.bonus_throws > 0:
                    game.bonus_throws -= 1
                    continue
                completed_bowlers.append(players.index(game))
                game.frame_active = False

    for game in players:
        game.frame_active = True
    frame += 1
    if frame > 10:
        for game in players:
            print(
                f"Player {game.player_num} scored: {game.score_game()}\t[{game.game_str}]")
        break
