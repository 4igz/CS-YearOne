from random import choice

card_types = [2, 3, 4, 5, 6, 7, 8, 9, 10, "A", "J", "K", "Q"]
suits = ["hearts", "spades", "diamonds", "clubs"]
first_run = True
losses = 0
wins = 0


def get_deck():
    deck = []
    for card in card_types:
        for suit in suits:
            deck.append({'value': card, 'suit': suit})
    return deck


def draw(deck: list):
    return deck.pop(choice(range(len(deck))))


def show_card(card):
    return f"{card['value']} of {card['suit'].capitalize()}"


def hand_v(hand):
    values = (0, 0)
    for card in hand:
        v = card['value']
        if isinstance(v, str):
            if v.lower() != "a":
                values = (values[0] + 10, values[1] + 10)
            else:
                values = (values[0] + 1, values[1] + 11)
        elif isinstance(v, int):
            values = (values[0] + v, values[1] + v)
    return values


def known_dealer_hand(hand):
    hand = hand[:]
    hand.pop(0)
    return hand


def print_hand(hand):
    for card in hand:
        print(show_card(card), end=", ")


def print_hand_value(plr_name, hand, is_plr):
    v1, v2 = hand_v(hand)
    if v1 != v2:
        print(f"{plr_name}'s{' ' if is_plr else ' known '}hand is worth {v1} or {v2}")
    else:
        print(f"{plr_name}'s{' ' if is_plr else ' known '}hand is worth {v1}")


while True:  # Program
    if not first_run:
        print(f"{wins = } {losses = }")
        agreed = False
        while True:
            should_play = input("\n\nStart a new game? (y/n): ")
            if should_play.lower() == "y" or should_play.lower() == "yes":
                agreed = True
                break
            elif should_play.lower() == "n" or should_play.lower() == "no":
                break
        if not agreed:
            break
    else:
        first_run = False
    print("\n\n\nStarting new game.")
    deck = get_deck()
    shown_card = draw(deck)
    dealer_hand = [draw(deck), shown_card]
    player_hand = [draw(deck), draw(deck)]
    print(f"Dealers shown card: {show_card(shown_card)}")
    while True:  # Game
        print_hand(player_hand)
        player_v1, player_v2 = hand_v(player_hand)
        dealer_v1, dealer_v2 = hand_v(dealer_hand)
        print_hand_value("player", player_hand, True)
        print_hand_value("Dealer", known_dealer_hand(dealer_hand), False)

        if player_v1 > 21:
            # Player busts
            print(f"Player busts! Dealer's hand value was {dealer_v1}.")
            losses += 1
            break
        elif player_v1 == 21 or player_v2 == 21:
            # Player wins, blackjack
            print("Player wins! Blackjack!")
            wins += 1
            break
        if dealer_v1 > 21:
            # Dealer busts
            print(
                f"Player wins! Dealer busts with {dealer_v1} total card value.")
            wins += 1
            break
        action = input(
            "Do you want to hit or stand? (h/s): ")[0].lower()
        if action == "h":
            player_hand.append(draw(deck))
        elif action == "s":
            if dealer_v2 > player_v2:
                # Dealer will stand, and end game.
                print(
                    f"Player lost! Dealer's hand value was {dealer_v1 if dealer_v2 > 21 else dealer_v2}.")
                losses += 1
                break
            elif player_v1 == dealer_v1 and player_v2 == dealer_v2:
                print("The game is a push! Nobody wins.")
                break
            elif player_v2 > dealer_v2:
                # Dealer will hit
                if dealer_v1 > 16:
                    # Dealer_v is more than 16, he is obligated to stand.
                    print("Dealer stands, player wins!")
                    wins += 1
                    break
                else:
                    new_draw = draw(deck)
                    # Dealer_v is less than 16, he is obligated to hit.
                    print("Dealer draws", show_card(new_draw))
                    dealer_hand.append(new_draw)
